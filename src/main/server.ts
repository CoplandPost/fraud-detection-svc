import 'module-alias/register'

import App from './config/app'
import dev from './config/dev'

App.listen(dev.port, () => console.log(`Server is running o port ${dev.port}`))
