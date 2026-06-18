import {
    createReadStream,
    createWriteStream,
  } from 'fs';
  
  import {
    pipeline
  } from 'stream';
  
  const {
    scrypt,
    randomFill,
    createCipheriv
  } = await import('node:crypto');
  
  const algorithm = 'aes-192-cbc';
  const password = 'Password used to generate key';
  
  // 首先，将生成密钥。密钥长度取决于算法。
  // 在此示例中，用于 aes192，长度是 24 个字节（192 位）。
  scrypt(password, 'salt', 24, (err, key) => {
    if (err) throw err;
    // 然后，将生成随机的初始化向量
    randomFill(new Uint8Array(16), (err, iv) => {
      if (err) throw err;
  
      const cipher = createCipheriv(algorithm, key, iv);
  
      const input = createReadStream('test.js');
      const output = createWriteStream('test.enc');
  
      pipeline(input, cipher, output, (err) => {
        if (err) throw err;
      });
    });
  });