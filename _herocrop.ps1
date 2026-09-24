# Cuts the hero band out of the full save-the-date card.
#   Left  x=80    drops the vertical "designed by" watermark in that margin
#   Top   y=1620  a little sky above the couple's heads (~1720)
#   Bottom y=2555 Amar's sneaker sole ends at 2545; cuts at his feet, which
#                 slices the tractor's lower wheels off
param(
  [int]$Left = 80,
  [int]$Top = 1620,
  [int]$Right = 1620,
  [int]$Bottom = 2555,
  [int]$OutWidth = 1400,
  [string]$Out = "assets\hero-scene-web.jpg"
)

Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile((Resolve-Path "assets\save-the-date.png"))

$cw = $Right - $Left
$ch = $Bottom - $Top
$ow = [int]$OutWidth
$oh = [int][math]::Round(([double]$ch / [double]$cw) * $ow)

$bmp = New-Object System.Drawing.Bitmap $ow, $oh
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.PixelOffsetMode = 'HighQuality'
$g.DrawImage(
  $src,
  (New-Object System.Drawing.Rectangle 0, 0, $ow, $oh),
  (New-Object System.Drawing.Rectangle $Left, $Top, $cw, $ch),
  [System.Drawing.GraphicsUnit]::Pixel
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, 84
)
$bmp.Save((Join-Path (Get-Location) $Out), $codec, $params)

"{0}: {1} x {2}  (aspect {3:N3})" -f $Out, $ow, $oh, ($ow / $oh)

$g.Dispose(); $bmp.Dispose(); $src.Dispose()
