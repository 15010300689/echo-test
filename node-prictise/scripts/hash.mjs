const {
    createHash
  } = await import('node:crypto');
  
  const hash = createHash('sha256');
  
  hash.on('readable', () => {
    // 哈希流只生成
    // 一个元素。
    const data = hash.read();
    if (data) {
      console.log(data.toString('hex'));
      // 打印:
      //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
    }
  });
  
  hash.write('some data to hash');
  hash.end();