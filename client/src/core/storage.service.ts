export default class StorageService {
  // This function is used to set an item in the local storage
  public static setItem(key: string, value: any) {
    console.log(`Setting ${key} in storage:`, value);
    
    try {
      // Handle different types of values
      let stringValue: string;
      if (typeof value === 'object') {
        stringValue = JSON.stringify(value);
      } else {
        stringValue = String(value);
      }
      
      // Store the value
      localStorage.setItem(key, stringValue);
      
      // Verify the value was stored correctly
      const storedValue = localStorage.getItem(key);
      console.log(`Stored ${key} value:`, storedValue);
      
      if (storedValue !== stringValue) {
        console.error(`Failed to store ${key} correctly. Expected: ${stringValue}, Got: ${storedValue}`);
        throw new Error(`Failed to store ${key} correctly`);
      }
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  // This function is used to get an item from the local storage
  public static getItem(key: string) {
    try {
      const value = localStorage.getItem(key);
      console.log(`Getting ${key} from storage:`, value);
      
      if (!value) return null;
      
      // Special handling for access_token and company_id to avoid JSON parsing
      if (key === 'access_token' || key === 'company_id') {
        return value;
      }
      
      try {
        return JSON.parse(value);
      } catch {
        // If parsing fails, return the raw value
        return value;
      }
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  // This function is used to remove an item from the local storage
  public static removeItem(key: string) {
    try {
      console.log(`Removing ${key} from storage`);
      localStorage.removeItem(key);
      
      // Verify removal
      const value = localStorage.getItem(key);
      if (value !== null) {
        console.error(`Failed to remove ${key} from storage`);
        throw new Error(`Failed to remove ${key} from storage`);
      }
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw error;
    }
  }
}
