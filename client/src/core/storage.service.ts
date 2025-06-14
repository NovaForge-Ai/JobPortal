export default class StorageService {
  // This function is used to set an item in the local storage
  public static setItem(key: string, value: any) {
    console.log(`Setting ${key} in storage:`, value);
    
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
    }
  }

  // This function is used to get an item from the local storage
  public static getItem(key: string) {
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
  }

  // This function is used to remove an item from the local storage
  public static removeItem(key: string) {
    console.log(`Removing ${key} from storage`);
    localStorage.removeItem(key);
  }
}
