import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentuser');
  return data;
};

export default LandingPage;
