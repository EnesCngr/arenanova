import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebasedConfig';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  storeid: string;
}

/**
 * Fetch menu items by storeid from Firebase
 */
export const getMenuByStoreId = async (storeId: string): Promise<MenuItem[]> => {
  try {
    console.log(`Fetching menu for storeid: ${storeId}`);
    const menuCollection = collection(db, 'menu');
    const q = query(menuCollection, where('storeid', '==', storeId));
    const querySnapshot = await getDocs(q);
    
    const items: MenuItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name || 'Unknown',
        description: data.Description || data.description || '',
        price: typeof data.price === 'number' ? data.price : 0,
        image: data.image || 'https://via.placeholder.com/100',
        storeid: data.storeid || '',
      });
    });
    
    console.log(`Menu items fetched for storeid ${storeId}:`, items.length);
    return items;
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    return [];
  }
};

/**
 * Fetch menu items for a specific restaurant from Firebase
 */
export const getMenuByRestaurant = async (restaurantName: string): Promise<MenuItem[]> => {
  return getMenuByStoreId(restaurantName.toLowerCase());
};
