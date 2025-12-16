import cloudinary from "./cloudinary.js";

/**
 * Alternative upload method using base64 data URI
 * This method is more reliable for timeout issues
 * @param {Buffer} buffer - The image buffer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - The secure image URL
 */
export async function uploadImageDirect(buffer, folder = "") {
  try {
    // Convert buffer to base64 data URI
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    
    // Upload using the upload method instead of upload_stream
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: "auto",
      timeout: 60000,
    });

    if (!result || !result.secure_url) {
      throw new Error("Upload succeeded but no URL returned");
    }

    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`);
  }
}
