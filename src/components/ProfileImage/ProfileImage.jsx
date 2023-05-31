import { Image } from 'react-bootstrap';
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import './ProfileImage.css';

export default function ProfileImage({ userId, urlImage }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      setUserData({
            displayName: currentUser.displayName,
            photoURL: urlImage,
          });
        }
    fetchUserData();
  }, [userId, urlImage]);

  if (userData) {
    const { photoURL } = userData;
    return (
      <div className="profile-image-wrapper">
        {photoURL && <Image src={photoURL} roundedCircle className="profile-image" />}
      </div>
    );
  } else {
    return null;
  }
}