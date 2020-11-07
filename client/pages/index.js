import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  const signedInString = currentUser
    ? 'You are signed in.'
    : 'You are not signed in.';

  return <h1 className='mx-auto mt-2 text-center'>{signedInString}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
