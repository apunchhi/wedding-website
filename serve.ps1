param([int]$Port = 8000)

$root = [IO.Path]::GetFullPath($PSScriptRoot)
$listener = [Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

$types = @{
  ".css"  = "text/css; charset=utf-8"
  ".gif"  = "image/gif"
  ".html" = "text/html; charset=utf-8"
  ".ico"  = "image/x-icon"
  ".jpeg" = "image/jpeg"
  ".jpg"  = "image/jpeg"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".svg"  = "image/svg+xml"
  ".webp" = "image/webp"
}

Write-Host "Wedding site: http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
    if ($relative -eq "/") { $relative = "/index.html" }
    $relative = $relative.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    $file = [IO.Path]::GetFullPath((Join-Path $root $relative))

    if (
      !$file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or
      !(Test-Path -LiteralPath $file -PathType Leaf)
    ) {
      $context.Response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("Not found")
    } else {
      $extension = [IO.Path]::GetExtension($file).ToLowerInvariant()
      $context.Response.ContentType = if ($types[$extension]) {
        $types[$extension]
      } else {
        "application/octet-stream"
      }
      $bytes = [IO.File]::ReadAllBytes($file)
    }

    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
