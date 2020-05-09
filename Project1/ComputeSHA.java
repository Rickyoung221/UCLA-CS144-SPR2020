import java.io.*;
import java.security.*;
import java.math.BigInteger;

public class ComputeSHA{
        static FileInputStream in = null;
        public static void main(String[] args) throws Exception  {
            //Creating the MessageDigest object
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
            try{
                        in = new FileInputStream( args[0] );
                }
                catch(FileNotFoundException e)
                {
                        System.out.println("File " + args[0] + " not found");
                        return;
                }

                byte[] dataBytes = new byte[1024];
                int temp = 0;
                //Pass the data to the created MessageDigest Object
                while((temp = in.read(dataBytes)) != -1){
                            messageDigest.update(dataBytes, 0, temp);
                        }
                        //Compute the message digest
                        byte[] digest = messageDigest.digest();
                        //Converte the byte array to HexString format
                        StringBuffer hexString = new StringBuffer();
                        for(int i = 0; i < digest.length; i++){
                         String h = Integer.toHexString(0xFF & digest[i]);
                        if (h.length()==1)
                        {       hexString.append("0"); 
                        }  
                        hexString.append(h);
                //  hexString.append(Integer.toHexString(0xFF & digest[i]));
                        }
                        in.close();
                        //Print the result
                        System.out.println(hexString.toString());
                        }
}
    
   
