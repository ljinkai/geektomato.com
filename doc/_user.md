When the _User table is being exported, the hashed password fields as well as the salt fields used for the encryption will be included. See the documentation for details.

导出用户数据的加密算法
导出的 _User 表数据会包括加密后的密码 password 字段和用于加密的随机盐 salt 字段。 LeanCloud 不会以明文保存任何用户的密码，我们也不推荐开发者以明文方式保存应用内用户的密码，这将带来极大的安全隐患。如果你要在 LeanCloud 系统之外校验用户的密码，需要将用户的传输过来的明文密码，加上导出数据里对应用户的 salt 字段，使用下文描述的加密算法进行不可逆的加密运算，其结果如果与导出数据里的 password 字段值相同，即认为密码验证通过，否则验证失败。

点击展开 用户数据的加密算法
我们通过一个 Ruby 脚本来描述这个用户密码加密算法：

创建 SHA-512 加密算法 hasher
使用 salt 和 password（原始密码） 调用 hasher.update
获取加密后的值 hv
重复 512 次调用 hasher.update(hv)，每次hv都更新为最新的 hasher.digest 加密值
最终的 hv 值做 base64 编码，保存为 password
假设：

salt	
h60d8x797d3oa0naxybxxv9bn7xpt2yiowz68mpiwou7gwr2

原始密码	password
加密后	
tA7BLW+NK0UeARng0693gCaVnljkglCB9snqlpCSUKjx2RgYp8VZZOQt0S5iUtlDrkJXfT3gknS4rRqjYsd/Ug==

实现代码：

require 'digest/sha2'
require "base64"

hasher = Digest::SHA512.new
hasher.reset
hasher.update "h60d8x797d3oa0naxybxxv9bn7xpt2yiowz68mpiwou7gwr2"
hasher.update "password"

hv = hasher.digest

def hashme(hasher, hv)
  512.times do
    hasher.reset
    hv = hasher.digest hv
  end
  hv
end

result = Base64.encode64(hashme(hasher,hv))
puts result.gsub(/\n/,'')

非常感谢用户「残圆」贡献了一段 C# 语言示例代码：

/// 根据数据字符串和自定义 salt 值，获取对应加密后的字符串
/// </summary>
/// <param name="password">数据字符串</param>
/// <param name="salt">自定义 salt 值</param>
/// <returns></returns>
public static string SHA512Encrypt(string password, string salt)
{
    /*
    用户密码加密算法
    1、创建 SHA-512 加密算法 hasher
    2、使用 salt 和 password（原始密码） 调用 hasher.update
    3、获取加密后的值 hv
    4、重复 512 次调用 hasher.update(hv)，每次hv都更新为最新的 hasher.digest 加密值
    5、最终的 hv 值做 base64 编码，保存为 password
    */
    password = salt + password;
    byte[] bytes = System.Text.Encoding.UTF8.GetBytes(password);
    byte[] result;
    System.Security.Cryptography.SHA512 shaM = new System.Security.Cryptography.SHA512Managed();
    result = shaM.ComputeHash(bytes);
    int i = 0;
    while (i++ < 512)
    {
        result = shaM.ComputeHash(result);
    }
    shaM.Clear();
    return Convert.ToBase64String(result);
}

非常感谢用户「snnui」贡献了一段 JavaScript（NodeJS） 语言示例代码：

function encrypt(password,salt) {
  var hash = crypto.createHash('sha512');
  hash.update(salt);
  hash.update(password);
  var value = hash.digest();

  for (var i = 0; i < 512; i++) {
      var hash = crypto.createHash('sha512');
      hash.update(value);
      value = hash.digest();
  }

  var result = value.toString('base64');
  return result;
}

保留字段
注意，createdAt 和 updatedAt 属于保留字段，导出数据中直接编码为 UTC 时间戳字符串，和普通 Date 类型字段的编码方式不同。这一点与通过 REST API 查询这两个字段的返回结果是一致的。

{
  "normalDate": {
    "__type": "Date",
    "iso": "2015-06-21T18:02:52.249Z"
  },
  "createdAt": "2015-06-21T18:02:52.249Z",
  "updatedAt": "2015-06-21T18:02:52.249Z"

}