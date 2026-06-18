public class HelloWorld{
    public static void main(String [] args){
        System.out.println('Hello world')
    }
}

class FreshJuice{
    enum FreshJuiceSize{ SMALL, MEDIUM, LARGE}
    FreshJuiceSize size;
}

public class FreshJuiceTest{
    public static void main(String []  args) {
        FreshJuice juice = new FreshJuice();
        juice.size = FreshJuice.FreshJuiceSize.MEDIUM;
    }
}

class MobilePhone {
    // 成员属性
    String brand;
    String color;
    double internalMemory;
    double size;
    // 成员方法
    void call(String phoneNumber) {
        System.out.println("正在给" + phoneNumber + "打电话");
    }
    void sendMessage(String phoneNumber) {
        System.out.println("正在给" + phoneNumber + "发短信");
    }
    void takePhoto() {
        System.out.println("正在拍照");
    }
    void playGame(String gameName) {
        System.out.println("正在玩" + gameName);
    }
    void watchVideo(String videoName) {
        System.out.println("正在看" + videoName);
    }
    void watchTV(String channelName) {
        System.out.println("正在看" + channelName);
    }
}


public class Test {
    public static void main(String[] args) {
        MobilePhone phone = new MobilePhone(); // 实力对象
        phone.brand = "华为";
        phone.color = "黑色";
        phone.internalMemory = 128;
        phone.size = 6.5;
        phone.call("13800138000");
    }
}

/** 
 * 访问控制：
 * public 公共的
 * private 私有的
 * protected 受保护的
 * default 默认的
 */

/**
 * 类、方法和变量修饰符
 * abstract 声明抽象
 * class 类
 * extends 扩充、继承
 * final 最终的、不可变的
 * implements 实现（接口）
 * interface 接口
 * native 本地、原生方法（非java实现）
 * new 创建
 * static 静态
 * strictfp 严格浮点、精准浮点
 * synchronized 线程、同步
 * transient 短暂
 * volatile 易失
 */

 /**
  * 程序控制语句
  * break 跳出循环
  * case 定义一个值供switch选择
  * continue 继续
  * do 运行
  * else 否则
  * for 循环
  * if 条件判断
  * instanceof 实例
  * return 返回
  * switch 根据值选择执行
  * while 循环
  */

  /**
   * 错误处理
   * assert 断言表达式是否为真
   * catch 捕捉异常
   * finally 最后，无论是进入try还是catch最终都会执行finally
   * throw 抛出异常
   * throws 声明一个异常可能被抛出
   * try 捕获异常
   */

   /**
    * 包相关
    * import 引入
    * package 包
    */

    /**
     * 数据基本类型
     * boolean 布尔型
     * byte 字节型
     * char 字符串型
     * double 双精度浮点型
     * float 单精度浮点型
     * int 整型
     * long 长整型
     * short 短整型
     */

     /**
      * 变量引用
      * super 父类、超类
      * this 本类
      * void 无返回值
      */

      /**
       * 保留关键字
       * goto 
       * const
       */