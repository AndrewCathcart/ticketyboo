import axios from 'axios';

const buildClient = ({ req }) => {
  const serverUrl =
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
  const browserUrl = '/';

  return typeof window === 'undefined'
    ? axios.create({ baseURL: serverUrl, headers: req.headers })
    : axios.create({ baseURL: browserUrl });
};

export default buildClient;
