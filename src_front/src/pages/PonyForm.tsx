import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getPony, createPony, updatePony } from '../api/ponies'

const schema = Yup.object({ name: Yup.string().required('Name is required') })

export default function PonyForm() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const fileRef = useRef<HTMLInputElement>(null)
    const isEdit = Boolean(id)

    const formik = useFormik({
        initialValues: { name: '' },
        validationSchema: schema,
        onSubmit: async (values) => {
            const fd = new FormData()
            fd.append('name', values.name)
            if (fileRef.current?.files?.[0]) {
                fd.append('image', fileRef.current.files[0])
            }
            if (isEdit) {
                await updatePony(Number(id), fd)
            } else {
                await createPony(fd)
            }
            navigate('/')
        },
    })

    useEffect(() => {
        if (isEdit) {
            getPony(Number(id)).then((r) => {
                formik.setFieldValue('name', r.data.name)
            })
        }
    }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 480 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {isEdit ? 'Edit Pony' : 'New Pony'}
            </Typography>
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
                <input type="file" accept="image/*" ref={fileRef} />
            </Box>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                {isEdit ? 'Save' : 'Create'}
            </Button>
        </Box>
    )
}
