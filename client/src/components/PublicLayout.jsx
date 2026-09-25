import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
