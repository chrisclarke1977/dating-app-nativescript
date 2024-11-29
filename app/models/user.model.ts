export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio: string;
  age: number;
  interests: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  matches: string[];
  lastActive: Date;
}