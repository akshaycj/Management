//import {browserHistory} from 'react-router';

import Base from './Base';
import App from './App'
import Marks from './Marks';
import Image from './Images';
import Feed from './Feed';

const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/admission',
      component: App
    },

    {
        path: '/marks',
        component: Marks
    },
    {
        path: '/images',
        component: Image
    },
    {
        path: '/',
        component: Feed
    }


  ]
};

export default routes;
