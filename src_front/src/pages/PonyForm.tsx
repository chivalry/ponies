import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getPony, createPony, updatePony } from '../api/ponies'

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  imageUrl: Yup.string().url('Must be a valid URL').optional(),
})

/** Form for creating a new pony or editing an existing one, with image upload or URL. */
export default function PonyForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(id)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: { name: '', imageUrl: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      setSubmitError(null)
      const fd = new FormData()
      fd.append('name', values.name)
      if (fileRef.current?.files?.[0]) {
        fd.append('image', fileRef.current.files[0])
      } else if (values.imageUrl) {
        fd.append('image_url', values.imageUrl)
      }
      try {
        if (isEdit) {
          await updatePony(Number(id), fd)
        } else {
          await createPony(fd)
        }
        navigate('/')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
        setSubmitError(msg)
      }
    },
  })

  useEffect(() => {
    if (isEdit) {
      getPony(Number(id))
        .then((r) => {
          formik.setFieldValue('name', r.data.name)
        })
        .catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : 'Failed to load pony.'
          setSubmitError(msg)
        })
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 480 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {isEdit ? 'Edit Pony' : 'New Pony'}
      </Typography>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Image (optional)
        </Typography>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={() => formik.setFieldValue('imageUrl', '')}
        />
      </Box>
      <TextField
        fullWidth
        label="Image URL (optional)"
        name="imageUrl"
        value={formik.values.imageUrl}
        onChange={(e) => {
          if (fileRef.current) fileRef.current.value = ''
          formik.handleChange(e)
        }}
        error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
        helperText={formik.touched.imageUrl && formik.errors.imageUrl}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
        {isEdit ? 'Save' : 'Create'}
      </Button>
    </Box>
  )
}
