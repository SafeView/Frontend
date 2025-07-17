// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { FaHome, FaCamera, FaBell, FaChartBar, FaCog } from 'react-icons/fa';

const SidebarWrapper = styled.aside`
  width: 250px;
  background-color: #181b23;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 3rem;
`;

const MenuLink = styled(Link)<{ active: boolean }>`
  color: ${({ active }) => (active ? '#fff' : '#aaa')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${({ active }) => (active ? '#2a2e39' : 'transparent')};

  &:hover {
    background-color: #2a2e39;
    color: #fff;
  }
`;

const Sidebar = () => {
    const location = useLocation();

    const menus = [
        { path: '/', label: 'Overview', icon: <FaHome /> },
        { path: '/cameras', label: 'Cameras', icon: <FaCamera /> },
        { path: '/alerts', label: 'Alerts', icon: <FaBell /> },
        { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
        { path: '/settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <SidebarWrapper>
            <Title>VISTA-Guard</Title>
            {menus.map((menu) => (
                <MenuLink
                    key={menu.path}
                    to={menu.path}
                    active={location.pathname === menu.path}
                >
                    {menu.icon}
                    {menu.label}
                </MenuLink>
            ))}
        </SidebarWrapper>
    );
};

export default Sidebar;
