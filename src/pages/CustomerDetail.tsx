import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import axiosInstance from '../components/AxiosInstance';

interface Address {
  _id: string;
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

interface UserData {
  _id: string;
  mobileNumber: string;
  isActive: boolean;
  isVerified: boolean;
  wallet: number;
  walletLastUpdated: string;
  createdAt: string;
  role: string;
  addresses?: Address[];
  favorites?: any[];
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get<UserData>(`/api/users/6830197b42360df990857fb5`);
        setUserData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <p>Loading user profile...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorContainer>Error: {error}</ErrorContainer>;
  }

  if (!userData) {
    return <ErrorContainer>No user data available</ErrorContainer>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>{userData.mobileNumber.slice(0, 2)}</Avatar>
        <UserInfo>
          <UserName>User Profile</UserName>
          <UserContact>{userData.mobileNumber}</UserContact>
        </UserInfo>
      </ProfileHeader>

      <ProfileDetails>
        <DetailCard>
          <DetailTitle>Account Status</DetailTitle>
          <DetailValue>
            <StatusIndicator active={userData.isActive} />
            {userData.isActive ? 'Active' : 'Inactive'}
          </DetailValue>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Verification</DetailTitle>
          <DetailValue>
            {userData.isVerified ? 'Verified' : 'Not Verified'}
          </DetailValue>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Wallet Balance</DetailTitle>
          <DetailValue>₹{userData.wallet.toFixed(2)}</DetailValue>
          <LastUpdated>
            Last updated: {new Date(userData.walletLastUpdated).toLocaleString()}
          </LastUpdated>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Member Since</DetailTitle>
          <DetailValue>{new Date(userData.createdAt).toLocaleDateString()}</DetailValue>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Role</DetailTitle>
          <DetailValue>{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</DetailValue>
        </DetailCard>
      </ProfileDetails>

      <AddressSection>
        <SectionTitle>Saved Addresses</SectionTitle>
        {userData.addresses && userData.addresses.length > 0 ? (
          userData.addresses.map((address) => (
            <AddressCard key={address._id}>
              <AddressText>
                <AddressLabel>{address.label}</AddressLabel>
                <AddressLine>{address.address}</AddressLine>
                {address.latitude && address.longitude && (
                  <AddressCoordinates>
                    Coordinates: {address.latitude}, {address.longitude}
                  </AddressCoordinates>
                )}
              </AddressText>
            </AddressCard>
          ))
        ) : (
          <EmptyState>
            <EmptyStateText>No saved addresses</EmptyStateText>
          </EmptyState>
        )}
      </AddressSection>

      {userData.favorites && userData.favorites.length > 0 && (
        <FavoritesSection>
          <SectionTitle>Favorites</SectionTitle>
          {/* Render favorites here */}
        </FavoritesSection>
      )}
    </ProfileContainer>
  );
};

// Styled components
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #4a6cf7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1.5rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const UserContact = styled.p`
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1rem;
`;

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DetailCard = styled.div`
  background: #f9f9f9;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const DetailTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const DetailValue = styled.p`
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const StatusIndicator = styled.span<{ active: boolean }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => (props.active ? '#4CAF50' : '#F44336')};
  margin-right: 8px;
`;

const LastUpdated = styled.small`
  display: block;
  margin-top: 0.5rem;
  color: #888;
  font-size: 0.75rem;
`;

const AddressSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem;
  color: #444;
  font-size: 1.1rem;
`;

const AddressCard = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
`;

const AddressText = styled.div`
  color: #333;
`;

const AddressLabel = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const AddressLine = styled.div`
  margin-bottom: 0.5rem;
`;

const AddressCoordinates = styled.small`
  display: block;
  color: #888;
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  margin: 1rem 0;
  background: #f9f9f9;
  border-radius: 8px;
`;

const EmptyStateText = styled.p`
  margin: 0;
  color: #888;
`;

const FavoritesSection = styled.div`
  margin-top: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #f44336;
  background: #ffebee;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 800px;
`;

export default UserProfile;
