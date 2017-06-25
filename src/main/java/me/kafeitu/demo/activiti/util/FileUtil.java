package me.kafeitu.demo.activiti.util;

import java.io.*;

/**
 * @author kevin
 * @date 2017/6/23
 */
public class FileUtil {


    /**
     * 通过CLASSPATH读取文件内容，注意以“/”开头
     *
     * @param classPath   路径
     * @return 文件内容
     */
    public static String readClassPathFile(String classPath) {
        InputStream in = FileUtil.class.getResourceAsStream(classPath);
        return stream2String(in, "UTF-8");
    }

    /**
     * 文件转换为字符串
     *
     * @param in      字节流
     * @param charset 文件的字符集
     * @return 文件内容
     */
    public static String stream2String(InputStream in, String charset) {
        StringBuffer sb = new StringBuffer();
        try {
            Reader r = new InputStreamReader(in, charset);
            int length = 0;
            for (char[] c = new char[1024]; (length = r.read(c)) != -1;) {
                sb.append(c, 0, length);
            }
            r.close();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sb.toString();
    }

}

