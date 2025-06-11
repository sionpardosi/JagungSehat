const { createClient } = require("@supabase/supabase-js")
const path = require('path')
const { v4: uuid } = require('uuid')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)
const bucket = process.env.SUPABASE_BUCKET

const addImage = async(file) => {
    const fileExt = path.extname(file.originalname)
    const fileName = uuid() + fileExt

    const { error } = await supabase.storage.from(bucket).upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
    })

    if (error){
        throw new Error(error.message)
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return data.publicUrl
}

const deleteImage = async(fileName) => {
    const { error } = await supabase.storage.from(bucket).remove(fileName)

    if (error){
        throw new Error(error.message)
    }
}

module.exports = { addImage, deleteImage }