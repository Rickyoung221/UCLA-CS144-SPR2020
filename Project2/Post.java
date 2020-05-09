import java.sql.Timestamp;
import java.text.SimpleDateFormat;



public class Post {
	public String username;
	public int postid;
	public String title;
	public String body;
	public Timestamp modified;
	public Timestamp created;
	public String modified_formatted;
	public String created_formatted;

	public Post(String username, int postid, String title, String body, Timestamp modified, Timestamp created) {
		this.username = username;
		this.postid = postid;
		this.title = title;
		this.body = body;
		this.modified = modified;
		this.created = created;

		SimpleDateFormat ft = new SimpleDateFormat ("MM/dd/yyyy HH:mm");
		this.modified_formatted = ft.format(modified);
		this.created_formatted = ft.format(created);
	}
}