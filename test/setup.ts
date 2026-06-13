import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeAll(async () => {
  try {
    const file = join(__dirname, '..', 'test.sqlite');
    await rm(file, { force: true });
  } catch (error) {
    console.log(error);
  }
});
