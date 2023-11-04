import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  DialogActions,
} from "@mui/material";
import { createCalendear, zeroPadding } from "./helper";

export default function Example() {
  // スケジュールのデータ
  const [schedules, setSche] = useState([]);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const calendar = createCalendear(year, month);
  const last = new Date(year, month, 0).getDate();
  const prevlast = new Date(year, month - 1, 0).getDate();

  const onClick = (n) => () => {
    const nextMonth = month + n;
    if (12 < nextMonth) {
      setMonth(1);
      setYear(year + 1);
    } else if (nextMonth < 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(nextMonth);
    }
  };

  // 画面読み込み時に、1度だけ起動
  useEffect(() => {
    axios
      .post("/api/posts")
      .then((response) => {
        setSche(response.data); // バックエンドからのデータをセット
        console.log(response.data);
      })
      .catch(() => {
        console.log("通信に失敗しました");
      });
  }, []);

  // データ格納の空配列を作成
  let rows = [];

  // スケジュールデータをrowに格納する
  schedules.map((post) =>
    rows.push({
      sch_id: post.id,
      sch_category: post.sch_category,
      sch_contents: post.sch_contents,
      sch_date: post.sch_date,
      sch_time: post.sch_time,
    }),
  );

  // 登録用ポップアップ開閉処理
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const category_options = ["勉強", "案件", "テスト", "掃除"];
  // 新規登録用データ配列
  const [formData, setFormData] = useState({
    sch_category: category_options[0],
    sch_contents: "",
    sch_date: "",
    sch_hour: "00",
    sch_min: "00",
  });

  // 入力値を一時保存
  const inputChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    let formDatakey = value;
    let datas = Object.assign({}, formData);
    setFormData(datas);
    console.log(formData);
  };

  // 登録処理
  const createSchedule = async () => {
    // 入力値を投げる
    await axios
      .post("/api/posts/create", {
        sch_category: formData.sch_category,
        sch_contents: formData.sch_contents,
        sch_date: formData.sch_date,
        sch_time: formData.sch_hour + ":" + formData.sch_min,
      })
      .then((res) => {
        //戻り値をtodosにセット
        const tempPosts = post;
        tempPosts.push(res.data);
        setPosts(tempPosts);
        setFormData("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div className="calender-header">
        <h1>{`${year}年${month}月`}</h1>
        <div className="calender-nav">
          <button onClick={onClick(-1)}>{"<先月"}</button>
          <button onClick={onClick(1)}>{"翌月>"}</button>
        </div>
      </div>
      <table className="calender-table">
        <thead>
          <tr>
            <th>日</th>
            <th>月</th>
            <th>火</th>
            <th>水</th>
            <th>木</th>
            <th>金</th>
            <th>土</th>
          </tr>
        </thead>
        <tbody>
          {calendar.map((week, i) => (
            <tr key={week.join("")}>
              {week.map((day, j) => (
                <td key={`${i}${j}`} id={day} onClick={handleClickOpen}>
                  <div>
                    <div>
                      {day > last
                        ? day - last
                        : day <= 0
                        ? prevlast + day
                        : day}
                    </div>
                    <div className="schedule-area">
                      {rows.map(
                        (schedule, k) =>
                          schedule.sch_date ==
                            year +
                              "-" +
                              zeroPadding(month) +
                              "-" +
                              zeroPadding(day) && (
                            <div className="schedule-title" key={k}>
                              {schedule.sch_contents}
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>スケジュール登録</DialogContentText>
          <TextField
            margin="dense"
            id="sch_date"
            name="sch_date"
            label="予定日"
            type="text"
            fullWidth
            variant="standard"
            onChange={inputChange}
          />
          <InputLabel id="sch_time_label">時刻</InputLabel>
          <Select
            labelId="sch_hour"
            id="sch_hour_select"
            name="sch_hour"
            label="Hour"
            variant="standard"
            defaultValue={formData.sch_hour}
            onChange={inputChange}
          >
            {[...Array(60)].map((_, i) => (
              <MenuItem value={zeroPadding(i)}>{zeroPadding(i)}</MenuItem>
            ))}
          </Select>
          <Select
            labelId="sch_min"
            id="sch_min_select"
            name="sch_min"
            label="Min"
            variant="standard"
            defaultValue="00"
            onChange={inputChange}
          >
            {[...Array(60)].map((_, i) => (
              <MenuItem value={zeroPadding(i)}>{zeroPadding(i)}</MenuItem>
            ))}
          </Select>
          <InputLabel id="sch_category_label">カテゴリー</InputLabel>
          <Select
            labelId="sch_category"
            id="sch_category_select"
            name="sch_category"
            label="Category"
            variant="standard"
            defaultValue="勉強"
            onChange={inputChange}
          >
            {category_options.map((o) => (
              <MenuItem value={o}>{o}</MenuItem>
            ))}
          </Select>
          <TextField
            margin="dense"
            id="sch_contents"
            name="sch_contents"
            label="内容"
            type="text"
            fullWidth
            variant="standard"
            onChange={inputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createSchedule}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

if (document.getElementById("app")) {
  ReactDOM.render(<Example />, document.getElementById("app"));
}
