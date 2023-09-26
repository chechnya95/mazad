import { UserNameByLangPipe } from './user-name-by-lang.pipe';

describe('UserNameByLangPipe', () => {
  it('create an instance', () => {
    const pipe = new UserNameByLangPipe();
    expect(pipe).toBeTruthy();
  });
});
