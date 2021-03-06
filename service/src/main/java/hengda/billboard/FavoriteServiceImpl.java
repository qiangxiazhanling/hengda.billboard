package hengda.billboard;

import com.google.gson.Gson;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class FavoriteServiceImpl extends FavoriteGrpc.FavoriteImplBase {

  private static final Logger logger = LoggerFactory.getLogger(FavoriteServiceImpl.class);

  @Override
  public void list(FavoriteRequest req, StreamObserver<FavoriteReply> responseObserver) {
    logger.info("FavoriteServiceImpl.list");
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try (Connection conn = DBUtil.getConn()) {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      String sql = "select r.id, r.uuid, r.name, r.address1, r.address2, r.address3, r.qty, r.salary1, r.salary2, r.date, t.category2,(select name from enterprise where id = r.id)\n"
          + "as enterprise_name from (select data_id, category2 from favorite where category1 = ? and category2 = '岗位'  and user_id =?) as t  join recruitment as r on data_id = r.id\n"
          + "union\n"
          + "select  c.id, c.uuid, c.title,  c.address_level1, c.address_level2, c.address_level3, '', '', '', c.date,   t.category2, c.school as enterprise_name from\n"
          + "(select data_id, category2 from favorite where category1 = ? and category2 = '校园招聘'  and user_id =? ) as t join campus as c on data_id = c.id\n"
          + "union\n"
          + "select  re.id, re.uuid, re.title, re.address_level1, re.address_level2, '', re.qty, '', '', re.date1,   t.category2, re.publisher as enterprise_name from\n"
          + "(select data_id, category2 from favorite where category1 = ? and category2 = '推荐信息'  and user_id =? ) as t join recommend as re on data_id = re.id";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, body.get("category1").toString());
        ps.setString(2, body.get("user_id").toString());
        ps.setString(3, body.get("category1").toString());
        ps.setString(4, body.get("user_id").toString());
        ps.setString(5, body.get("category1").toString());
        ps.setString(6, body.get("user_id").toString());
        ResultSet rs = ps.executeQuery();
        List<Map<String, Object>> result = DBUtil.getList(rs);
        resp.put("content", result);
      }
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    FavoriteReply reply = FavoriteReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void searchOne(FavoriteRequest req, StreamObserver<FavoriteReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try (Connection conn = DBUtil.getConn()) {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      String sql = "select * from favorite where user_id = ? and data_id = ? and category1 = ? and category2 = ? limit 1";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, body.get("user_id").toString());
        ps.setString(2, body.get("data_id").toString());
        ps.setString(3, body.get("category1").toString());
        ps.setString(4, body.get("category2").toString());
        ResultSet rs = ps.executeQuery();
        List<Map<String, Object>> result = DBUtil.getList(rs);
        if (result.size() == 0) {
          resp.put("content", false);
        } else {
          resp.put("content", result.get(0));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    FavoriteReply reply = FavoriteReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void searchResume(FavoriteRequest req, StreamObserver<FavoriteReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try (Connection conn = DBUtil.getConn()) {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      String sql = "select f.id, r.id as resume_id, r.uuid, r.name, r.education, r.school,"
          + "r.yixiangchengshi, r.qiwanghangye,  r.qiwangzhiwei from "
          + "favorite f left join resume r on f.data_id = r.id "
          + "where f.category1 = '企业用户' and f.category2 = '简历' and user_id = ?";
      List<String> list = new ArrayList<>();
      list.add(body.get("user_id").toString());
      if (body.get("name") != null && !"".equals(body.get("name").toString())) {
        sql += " and r.name like CONCAT(?,'%') ";
        list.add(body.get("name").toString());
      }
      if (body.get("qiwanghangye") != null && !"".equals(body.get("qiwanghangye").toString())) {
        sql += " and r.qiwanghangye like CONCAT(?,'%') ";
        list.add(body.get("qiwanghangye").toString());
      }
      if (body.get("qiwangzhiwei") != null && !"".equals(body.get("qiwangzhiwei").toString())) {
        sql += " and r.qiwangzhiwei like CONCAT(?,'%') ";
        list.add(body.get("qiwangzhiwei").toString());
      }
      if (body.get("yixiangchengshi") != null && !"".equals(body.get("yixiangchengshi").toString())) {
        sql += " and r.yixiangchengshi like CONCAT(?,'%') ";
        list.add(body.get("yixiangchengshi").toString());
      }
      if (body.get("education") != null && !"".equals(body.get("education").toString())) {
        sql += " and r.education = ? ";
        list.add(body.get("education").toString());
      }
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        for (int inx = 0; inx < list.size(); inx++) {
          ps.setString(inx + 1, list.get(inx));
        }
        ResultSet rs = ps.executeQuery();
        List<Map<String, Object>> result = DBUtil.getList(rs);
        resp.put("content", result);
      }
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    FavoriteReply reply = FavoriteReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void delete(FavoriteRequest req, StreamObserver<FavoriteReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try (Connection conn = DBUtil.getConn()) {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      String sql = "delete from favorite where id = ? limit 1";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, body.get("id").toString());
        ps.execute();
        resp.put("content", true);
      }
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    FavoriteReply reply = FavoriteReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void insert(FavoriteRequest req, StreamObserver<FavoriteReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try (Connection conn = DBUtil.getConn()) {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      String sql = "insert into favorite (user_id, data_id, category1, category2, datime) value (?, ?, ?, ?, ?)";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, body.get("user_id").toString());
        ps.setString(2, body.get("data_id").toString());
        ps.setString(3, body.get("category1").toString());
        ps.setString(4, body.get("category2").toString());
        ps.setString(5, new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
        ps.execute();
        resp.put("content", true);
      }
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    FavoriteReply reply = FavoriteReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

}