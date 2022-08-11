import App from '@/app';
import V1Router from '@routes/v1.route';
import RedirectRoute from '@routes/redirect.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new V1Router(), new RedirectRoute()]);

app.listen();
