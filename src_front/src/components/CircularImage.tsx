import { Box } from '@mui/material'

interface Props {
  src: string
  alt: string
  size: number
}

/** Displays an image cropped to a circle with the given diameter. */
export const CircularImage = ({ src, alt, size }: Props) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      display: 'block',
    }}
  />
)
