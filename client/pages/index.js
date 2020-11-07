import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  const headers = req.headers;
  const serverUrl =
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser';
  const browserUrl = '/api/users/currentuser';

  const { data } =
    typeof window === 'undefined'
      ? await axios.get(serverUrl, { headers })
      : await axios.get(browserUrl);

  return data;
};

export default LandingPage;
