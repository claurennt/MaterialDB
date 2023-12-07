import Navbar from './Navbar';
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);
