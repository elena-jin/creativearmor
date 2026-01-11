/**
 * Simulated Vultr Object Storage Service
 * In production, this would use Vultr's S3-compatible API
 */

export const uploadImage = async (imageFile: File): Promise<string> => {
  // Simulated upload
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock URL
  return `https://vultr-storage.example.com/images/${Date.now()}_${imageFile.name}`;
};

export const getImageUrl = async (imageId: string): Promise<string> => {
  // Simulated retrieval
  return `https://vultr-storage.example.com/images/${imageId}`;
};
