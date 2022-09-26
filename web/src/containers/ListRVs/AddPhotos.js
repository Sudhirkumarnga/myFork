// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useRef, useState } from 'react'
import { Grid } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

export default function AddPhotos ({ images, handleChange }) {
  const fileInput1 = useRef()
  const fileInput2 = useRef()
  const fileInput3 = useRef()
  const fileInput4 = useRef()
  const fileInput5 = useRef()
  const fileInput6 = useRef()
  const fileInput7 = useRef()
  const fileInput8 = useRef()
  const fileInput9 = useRef()
  const fileInput10 = useRef()
  const fileInput11 = useRef()
  const fileInput12 = useRef()
  const fileInput13 = useRef()
  const fileInput14 = useRef()
  const fileInput15 = useRef()
  const fileInput16 = useRef()
  const fileInput17 = useRef()
  const fileInput18 = useRef()
  const fileInput19 = useRef()
  const fileInput20 = useRef()

  const [state, setState] = useState({
    loading: false,
    step: 0
  })

  const { image1 } = state

  const handleChangelocal = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const numberOfImages = [
    { key: 'image1', ref: fileInput1 },
    { key: 'image2', ref: fileInput2 },
    { key: 'image3', ref: fileInput3 },
    { key: 'image4', ref: fileInput4 },
    { key: 'image5', ref: fileInput5 },
    { key: 'image6', ref: fileInput6 },
    { key: 'image7', ref: fileInput7 },
    { key: 'image8', ref: fileInput8 },
    { key: 'image9', ref: fileInput9 },
    { key: 'image10', ref: fileInput10 },
    { key: 'image11', ref: fileInput11 },
    { key: 'image12', ref: fileInput12 },
    { key: 'image13', ref: fileInput13 },
    { key: 'image14', ref: fileInput14 },
    { key: 'image15', ref: fileInput15 },
    { key: 'image16', ref: fileInput16 },
    { key: 'image17', ref: fileInput17 },
    { key: 'image18', ref: fileInput18 },
    { key: 'image19', ref: fileInput19 },
    { key: 'image20', ref: fileInput20 }
  ]

  const selectFile = fileInput => {
    fileInput.current.click()
  }

  const onImageChange = (key, event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = e => {
        handleChangelocal(key, e.target.result)
      }
      reader.readAsDataURL(event.target.files[0])
      handleChange('images', [...images, event.target.files[0]])
    }
  }

  return (
    <div>
      <Grid container justifyContent={'center'}>
        <Grid item xs={12}>
          <p className='text_primary font-14 mb-3'>Minimum 4 pictures</p>
          <Grid container spacing={2}>
            {numberOfImages.map((num, index) => (
              <Grid key={index} item md={3} sm={6} xs={12}>
                <div
                  onClick={() =>
                    index === 0 || state[numberOfImages[index - 1].key]
                      ? selectFile(num.ref)
                      : console.log('')
                  }
                  style={{
                    opacity:
                      index > 1 && !state[numberOfImages[index - 1].key]
                        ? 0.5
                        : 1
                  }}
                  className='add_grp_image_div margin_bottom'
                >
                  {state[num.key] && (
                    <img src={state[num.key]} className='add_grp_image' />
                  )}
                  <input
                    type='file'
                    onChange={e => onImageChange(num.key, e, index)}
                    ref={num.ref}
                    style={{ display: 'none' }}
                    className='filetype'
                    id='group_image'
                  />
                  {!state[num.key] && <AddCircleOutlineOutlinedIcon />}
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
