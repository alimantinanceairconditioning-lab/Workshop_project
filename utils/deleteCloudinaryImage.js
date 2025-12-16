import cloudinary from './cloudinary';

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Full Cloudinary URL
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteCloudinaryImage(imageUrl) {
    try {
        if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
            return { success: false, error: 'Invalid Cloudinary URL' };
        }

        // Extract public_id from URL
        // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[public_id].[extension]
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        
        if (uploadIndex === -1) {
            return { success: false, error: 'Invalid Cloudinary URL format' };
        }

        // Get everything after 'upload/v123456789/' or 'upload/'
        let publicIdWithExtension;
        if (urlParts[uploadIndex + 1].startsWith('v')) {
            // Has version number
            publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        } else {
            // No version number
            publicIdWithExtension = urlParts.slice(uploadIndex + 1).join('/');
        }

        // Remove file extension
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok' || result.result === 'not found') {
            return { success: true };
        }

        return { success: false, error: `Cloudinary deletion failed: ${result.result}` };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} imageUrls - Array of Cloudinary URLs
 * @returns {Promise<{success: boolean, deleted: number, failed: number, errors: string[]}>}
 */
export async function deleteMultipleCloudinaryImages(imageUrls) {
    const results = {
        success: true,
        deleted: 0,
        failed: 0,
        errors: []
    };

    for (const url of imageUrls) {
        const result = await deleteCloudinaryImage(url);
        if (result.success) {
            results.deleted++;
        } else {
            results.failed++;
            results.errors.push(`Failed to delete ${url}: ${result.error}`);
        }
    }

    if (results.failed > 0) {
        results.success = false;
    }

    return results;
}
