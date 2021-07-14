import { DireflowComponent } from 'direflow-component';
import App from './App';

export default DireflowComponent.create({
  component: App,
  configuration: {
    tagname: 'advanced-survey',
  },
  properties: {
    id: 0,
    save_url: '',
  },
  plugins: [
    {
      name: 'external-loader',
      options: {
        paths: [
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js'
        ],
      }
    },
  ],
});
