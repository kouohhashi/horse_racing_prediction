
// Set command
process.setMaxListeners(0);

var mongo_options = {
  'native_parser':true,
  'poolSize': 5
};
var mongo = require('mongoskin');
var mongodb = mongo.db("mongodb://127.0.0.1:27017/keiba", mongo_options);

var async = require('async');

//
// functions
//

// start_insert_sqlite_data
var start_insert_sqlite_data = function(table_name){

  console.log("======================================");
  console.log("= start "+new Date()+" =");
  console.log("======================================");

  var max_count = 4000000000;
  var go_next = null;
  var count = 0;

  // processing...
  async.waterfall([
    function(callback){
      // loop
      async.whilst(
        function () {

          // check_articles_err
          if (go_next != null){
            return false;
          } else {
            return true;
          }
        },
        function (callback1) {

          // console.log("main func loop count:"+count);
          insert_sqlite_data( count, table_name, function(err, ok, ng){

            count++;

            if (err){
              console.log(err);
              go_next = err;
            }

            if (count > max_count){
              go_next = "reached "+max_count;
            }

            callback1();
          });
        },
        function (err, n) {
          // 5 seconds have passed, n = 5
          callback(null, 'ok');
        }
      );
    }
  ], function (err, result) {

    if (err){
      console.log(err);
    } else {
      console.log("======================================");
      console.log("= end "+new Date()+" =");
      console.log("======================================");
    }

    // console.log("total ok_count:"+ok_count+", ng_count:"+ng_count);

    process.kill(process.pid, 'SIGHUP');

  });
}
// insert_recent_data
var insert_sqlite_data = function(count, table_name, cb) {

  // console.log("insert_recent_data:1");

  var list = [];

  var offset = count * 3000;

  // processing...
  async.waterfall([
    function(callback){
      // console.log("insert_recent_data:2");

      // var query1 = "SELECT * from N_RACE WHERE DataKubun = '7' AND Year = '2017' AND MonthDay LIKE '05%' limit 3000 offset "+offset;
      var query1 = "SELECT * from N_UMA_RACE WHERE DataKubun = '7' limit 3000 offset "+offset;
      // console.log("query1:"+query1);

      keiba22.each( query1, function(err, row) {

        if (err){
          console.log(err);
        } else {
          list.push(row);
        }

      }, function(){
        callback(null, 'ok');
      });
    },
    function(status, callback){
      //
      console.log("list:");
      console.log(list.length);
      // return;

      if ( list.length == 0) {
        callback("no more data 1");
        return;
      }

      async.eachSeries(list, function(item1, callback1) {

        // console.log("dfasfaf 1");

        // race id: 20171028 0803
        // 2017 10 28, 08: place code, 03: race number

        var Year = item1.Year;
        var MonthDay = item1.MonthDay;
        var JyoCD = item1.JyoCD;
        var Kaiji = item1.Kaiji;
        var RaceNum = item1.RaceNum;

        var race_id = Year+MonthDay+JyoCD+RaceNum;

        var KettoNum = item1.KettoNum;

        var uma_race_id = race_id+KettoNum;

        var race_date = new Date(Year+'-'+MonthDay.substr(0,2)+'-'+MonthDay.substr(2,2));

        var find_param = {
          '_id':uma_race_id
        };

        mongodb.collection('N_UMA_RACE').findOne(find_param, function(err, data){
          if (err){
            console.log(err);
            callback1();
            return;
          }

          if (!data){
            // not found
            console.log(" : not found, race_id:"+race_id);

            // _zogenSa: parseInt(item1.ZogenSa),
            var _zogenSa = 0;
            if (item1.ZogenSa){
              _zogenSa = parseInt(item1.ZogenSa);
            }

            // insert
            var insert_param = {
              _id : uma_race_id,
              race_id: race_id,
              RecordSpec: item1.RecordSpec,
              DataKubun: item1.DataKubun,
              MakeDate: item1.MakeDate,
              Year: item1.Year,
              MonthDay: item1.MonthDay,
              JyoCD: item1.JyoCD,
              Kaiji: item1.Kaiji,
              Nichiji: item1.Nichiji,
              RaceNum: item1.RaceNum,
              Wakuban: item1.Wakuban,
              Umaban: item1.Umaban,
              KettoNum: item1.KettoNum,
              Bamei: item1.Bamei,
              UmaKigoCD: item1.UmaKigoCD,
              SexCD: item1.SexCD,
              HinsyuCD: item1.HinsyuCD,
              KeiroCD: item1.KeiroCD,
              Barei: item1.Barei,
              TozaiCD: item1.TozaiCD,
              ChokyosiCode: item1.ChokyosiCode,
              ChokyosiRyakusyo: item1.ChokyosiRyakusyo,
              BanusiCode: item1.BanusiCode,
              BanusiName: item1.BanusiName,
              Fukusyoku: item1.Fukusyoku,
              Futan: item1.Futan,
              FutanBefore: item1.FutanBefore,
              Blinker: item1.Blinker,
              KisyuCode: item1.KisyuCode,
              KisyuCodeBefore: item1.KisyuCodeBefore,
              KisyuRyakusyo: item1.KisyuRyakusyo,
              KisyuRyakusyoBefore: item1.KisyuRyakusyoBefore,
              MinaraiCD: item1.MinaraiCD,
              MinaraiCDBefore: item1.MinaraiCDBefore,
              BaTaijyu: item1.BaTaijyu,
              ZogenFugo: item1.ZogenFugo,
              ZogenSa: item1.ZogenSa,
              IJyoCD: item1.IJyoCD,
              NyusenJyuni: item1.NyusenJyuni,
              KakuteiJyuni: item1.KakuteiJyuni,
              DochakuKubun: item1.DochakuKubun,
              DochakuTosu: item1.DochakuTosu,
              Time: item1.Time,
              ChakusaCD: item1.ChakusaCD,
              ChakusaCDP: item1.ChakusaCDP,
              ChakusaCDPP: item1.ChakusaCDPP,
              Jyuni1c: item1.Jyuni1c,
              Jyuni2c: item1.Jyuni2c,
              Jyuni3c: item1.Jyuni3c,
              Jyuni4c: item1.Jyuni4c,
              Odds: item1.Odds,
              Ninki: item1.Ninki,
              Honsyokin: item1.Honsyokin,
              Fukasyokin: item1.Fukasyokin,
              HaronTimeL4: item1.HaronTimeL4,
              HaronTimeL3: item1.HaronTimeL3,
              TimeDiff: item1.TimeDiff,
              race_date: race_date,
              _year: parseInt(item1.Year),
              _raceNum: parseInt(item1.RaceNum),
              _wakuban: parseInt(item1.Wakuban),
              _umaban: parseInt(item1.Umaban),
              _barei: parseInt(item1.Barei),
              _futan: parseInt(item1.Futan),
              _futanBefore: parseInt(item1.FutanBefore),
              _baTaijyu: parseInt(item1.BaTaijyu),
              _zogenSa: _zogenSa,
              _nyusenJyuni: parseInt(item1.NyusenJyuni),
              _kakuteiJyuni: parseInt(item1.KakuteiJyuni),
              _dochakuTosu: parseInt(item1.DochakuTosu),
              _time: parseInt(item1.Time),
              _jyuni1c: parseInt(item1.Jyuni1c),
              _jyuni2c: parseInt(item1.Jyuni2c),
              _jyuni3c: parseInt(item1.Jyuni3c),
              _jyuni4c: parseInt(item1.Jyuni4c),
              _odds: parseInt(item1.Odds),
              _ninki: parseInt(item1.Ninki),
              _honsyokin: parseInt(item1.Honsyokin),
              _fukasyokin: parseInt(item1.Fukasyokin),
              _haronTimeL4: parseInt(item1.HaronTimeL4),
              _haronTimeL3: parseInt(item1.HaronTimeL3),
              _timeDiff: parseInt(item1.TimeDiff)
            }
            mongodb.collection('N_UMA_RACE').insert(insert_param, function(err){
              if (err){
                console.log(err)
              }

              callback1();
            })

          } else {
            console.log(" > found, race_id:"+race_id);
            callback1();
          }

        });
      }, function(){
        callback(null, 'ok');
      });
    }
  ], function (err, result) {
    if (err){
      console.log(err);
      cb(err);
    } else {
      console.log("success");
      cb();
    }
    return;
  });
};




// start_insert_race_data
var start_insert_race_data = function(table_name){

  console.log("======================================");
  console.log("= start "+new Date()+" =");
  console.log("======================================");

  var max_count = 4000000000;
  var go_next = null;
  var count = 0;

  // processing...
  async.waterfall([
    function(callback){
      // loop
      async.whilst(
        function () {

          // check_articles_err
          if (go_next != null){
            return false;
          } else {
            return true;
          }
        },
        function (callback1) {

          // console.log("main func loop count:"+count);
          insert_race_data( count, table_name, function(err, ok, ng){

            count++;

            if (err){
              console.log(err);
              go_next = err;
            }

            if (count > max_count){
              go_next = "reached "+max_count;
            }

            callback1();
          });
        },
        function (err, n) {
          // 5 seconds have passed, n = 5
          callback(null, 'ok');
        }
      );
    }
  ], function (err, result) {

    if (err){
      console.log(err);
    } else {
      console.log("======================================");
      console.log("= end "+new Date()+" =");
      console.log("======================================");
    }

    // console.log("total ok_count:"+ok_count+", ng_count:"+ng_count);

    process.kill(process.pid, 'SIGHUP');

  });
}
// insert_recent_data
var insert_race_data = function(count, table_name, cb) {

  // console.log("insert_recent_data:1");

  var list = [];

  var offset = count * 3000;

  // processing...
  async.waterfall([
    function(callback){
      // console.log("insert_recent_data:2");

      // var query1 = "SELECT * from N_RACE WHERE DataKubun = '7' AND Year = '2017' AND MonthDay LIKE '05%' limit 3000 offset "+offset;
      var query1 = "SELECT * from N_RACE WHERE DataKubun = '7' limit 3000 offset "+offset;
      // console.log("query1:"+query1);

      keiba22.each( query1, function(err, row) {

        if (err){
          console.log(err);
        } else {
          list.push(row);
        }

      }, function(){
        callback(null, 'ok');
      });
    },
    function(status, callback){
      //
      console.log("list:");
      console.log(list.length);
      // return;

      if ( list.length == 0) {
        callback("no more data 1");
        return;
      }

      async.eachSeries(list, function(item1, callback1) {

        // console.log("dfasfaf 1");

        // race id: 20171028 0803
        // 2017 10 28, 08: place code, 03: race number

        var Year = item1.Year;
        var MonthDay = item1.MonthDay;
        var JyoCD = item1.JyoCD;
        var Kaiji = item1.Kaiji;
        var RaceNum = item1.RaceNum;

        var race_id = Year+MonthDay+JyoCD+RaceNum;

        // var KettoNum = item1.KettoNum;

        // var uma_race_id = race_id+KettoNum;

        var race_date = new Date(Year+'-'+MonthDay.substr(0,2)+'-'+MonthDay.substr(2,2));

        var find_param = {
          '_id':race_id
        };

        mongodb.collection('N_RACE').findOne(find_param, function(err, data){
          if (err){
            console.log(err);
            callback1();
            return;
          }

          if (!data){
            // not found
            console.log(" : not found, race_id:"+race_id);

            // insert
            var insert_param = {
              _id : race_id,
              RecordSpec: item1.RecordSpec,
              DataKubun: item1.DataKubun,
              MakeDate: item1.MakeDate,
              Year: item1.Year,
              MonthDay: item1.MonthDay,
              JyoCD: item1.JyoCD,
              Kaiji: item1.Kaiji,
              Nichiji: item1.Nichiji,
              RaceNum: item1.RaceNum,
              Kubun: item1.Kubun,
              TenkoCD: item1.TenkoCD,
              SibaBabaCD: item1.SibaBabaCD,
              DirtBabaCD: item1.DirtBabaCD,
              Kyori: item1.Kyori,
              race_date: race_date,
              _year: parseInt(item1.Year),
              _kaiji: parseInt(item1.Kaiji),
              _nichiji: parseInt(item1.Nichiji),
              _raceNum: parseInt(item1.RaceNum),
              _kyori: parseInt(item1.Kyori)
            }
            mongodb.collection('N_RACE').insert(insert_param, function(err){
              if (err){
                console.log(err)
              }

              callback1();
            })

          } else {
            console.log(" > found, race_id:"+race_id);
            callback1();
          }

        });
      }, function(){
        callback(null, 'ok');
      });
    }
  ], function (err, result) {
    if (err){
      console.log(err);
      cb(err);
    } else {
      console.log("success");
      cb();
    }
    return;
  });
};























// start creating traiing data
var start_create_training_data = function(data_name, past_race_count){

  console.log("======================================");
  console.log("= start "+new Date()+" =");
  console.log("======================================");

  var max_count = 4000000000;
  // var max_count = 1;
  var go_next = null;
  var count = 0;

  var input_x_count = 0;
  var mean_and_std = null;

  // processing...
  async.waterfall([
    function(callback){
      // loop
      async.whilst(
        function () {

          // check_articles_err
          if (go_next != null){
            return false;
          } else {
            return true;
          }
        },
        function (callback1) {

          unko_batch( count, data_name, past_race_count, function(err, ok, ng){

            count++;

            if (err){
              console.log(err);
              go_next = err;
            }

            if (count > max_count){
              go_next = "reached "+max_count;
            }

            callback1();
          });
        },
        function (err, n) {
          // 5 seconds have passed, n = 5
          callback(null, 'ok');
        }
      );
    },
    function(status, callback){
      // normalize: check input_x count

      var find_param = {
        'data_name': data_name
      };
      mongodb.collection('training_data_'+data_name).findOne(find_param, function(err, data){
        if (err) {
          console.log(err);
          callback(err);
          return;
        }

        input_x_count = data.input_x_count;
        callback(null, 'ok');
      });
    },
    function(status, callback){
      // normalize: calculate std and mean

      var agg_param = {
        _id: null,
        target_y_mean: {
          $avg: "$target_y"
        },
        target_y_stddev: {
          $stdDevPop: "$target_y"
        },
      };

      for ( var i=0; i<input_x_count; i++) {

        // mean
        var key_mean = "input_x_avg_"+i;
        var value_mean = {
          $avg: "$input_x_object."+i
        }
        agg_param[key_mean] = value_mean;

        // std
        var key_std = "input_x_std_"+i;
        var value_std = {
          $stdDevPop: "$input_x_object."+i
        }
        agg_param[key_std] = value_std;
      }

      console.log("agg_param: ", agg_param)

      mongodb.collection('training_data_'+data_name).aggregate([
        {
          $match: {
            'data_name': data_name
          }
        },
        {
          $group: agg_param
        }
        ], function(err, data) {
        if (err){
          console.log("aggregate err: ", err);
          callback(err)
          rerturn;
        }

        if (!data || data.length == 0) {
          callback("no mean and std");
          return;
        }

        console.log("agg: ", data)

        mean_and_std = data[0];
        callback(null, 'ok');
      });
    },
    function(status, callback){
      // normalize: update traiing data

      // console.log("normalize start");
      // No, lets calculate mean and std at AI process

      var find_param = {
        _id: data_name
      }
      var upd_param = {
        '$set':{
          mean_and_std: mean_and_std,
          updatedAt: new Date()
        }
      }
      mongodb.collection('data_models_'+data_name).update(find_param, upd_param, {upsert: true}, function(err){
        if (err){
          callback(err);
          return;
        }
        callback(null, 'ok');
      });
    },
  ], function (err, result) {

    if (err){
      console.log(err);
    } else {
      console.log("======================================");
      console.log("= end "+new Date()+" =");
      console.log("======================================");
    }

    // console.log("total ok_count:"+ok_count+", ng_count:"+ng_count);

    process.kill(process.pid, 'SIGHUP');

  });
}

// find 1000 batch
var unko_batch = function(count, data_name, past_race_count, cb) {

  // console.log("insert_recent_data:1");

  var list = [];

  var limit = 100;
  var offset = count * limit;

  // processing...
  async.waterfall([
    function(callback){

      var flg_name = data_name+"Flg";

      var find_param = {};
      find_param[flg_name] = {
        '$ne': true
      };
      mongodb.collection('N_RACE').find(find_param).limit(limit).toArray(function(err, data) {
        if (err) {
          callback(err);
          return;
        }
        if (!data || data.length == 0){
          callback('no more data 2');
          return;
        }

        list = data;
        callback(null, 'ok');
      });
    },
    function(status, callback){

      async.eachSeries(list, function(item, callback1){
        create_unko(item, data_name, past_race_count, function(){
          callback1();
        })
      }, function(){
        callback(null, 'ok');
      });

    }
  ], function (err, result) {
    if (err){
      console.log(err);
      cb(err);
    } else {
      console.log("success");
      cb();
    }
    return;
  });
};



var create_unko = function(race_info, data_name, past_race_count, cb) {

  // data_name: past_1day_with_odds

  var race_id = null;
  var kyori = 0

  var uma_race_list = [];

  var input_x_count = 0;
  var mean_and_std = {};

  // processing...
  async.waterfall([
    function(callback){

      if (race_info) {
        race_id = race_info._id;
        kyori = race_info._kyori;
        console.log("race_id: ", race_id);
        callback(null, 'ok');
        return;
      }

      var flg_name = data_name+"Flg";
      var find_param = {};
      find_param[flg_name] = false;

      mongodb.collection('N_RACE').findOne(find_param, function(err, data){
        if (err) {
          console.log(err);
          callback(err);
          return;
        }

        race_id = data._id;
        kyori = data._kyori;
        console.log("race_id: ", race_id);
        callback(null, 'ok');
      });
    },
    function(status, callback){

      var find_param = {
        race_id: race_id
      }
      mongodb.collection('N_UMA_RACE').find(find_param).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        uma_race_list = data;
        console.log(data.length);

        callback(null, 'ok')
      });
    },
    function(status, callback){

      var uma_race_id_list = [];
      var uma_race_info_obj = {};
      for ( var i=0; i<uma_race_list.length; i++ ) {
        var KettoNum = uma_race_list[i].KettoNum;
        uma_race_id_list.push(KettoNum)
        uma_race_info_obj[KettoNum] = uma_race_list[i];
      }

      // console.log("uma_race_id_list: ", uma_race_id_list)

      var combinations = []

      for ( var i=0; i<uma_race_id_list.length; i++ ) {

        var baseKettoNum = uma_race_id_list[i]

        for ( var j=0; j<uma_race_id_list.length; j++ ) {
          var nextKettoNum = uma_race_id_list[j]
          if ( baseKettoNum != nextKettoNum ) {
            var combi = [baseKettoNum, nextKettoNum]
            combinations.push(combi);
          }
        }
      }
      // console.log("combinations: ", combinations);

      async.eachSeries(combinations, function(item, callback1){

        var uma_0 = item[0]
        var uma_1 = item[1]
        console.log("uma_0: ", uma_0, ", uma_1: "+ uma_1);

        var uma_0_info = uma_race_info_obj[uma_0];
        var uma_1_info = uma_race_info_obj[uma_1];

        // create and insert 1 record
        create_a_record(uma_0_info, uma_1_info, kyori, data_name, past_race_count, function(err, count){

          input_x_count = count
          callback1();
        })

      }, function(){
        callback(null, 'ok');
      });
    },
    // function(status, callback){
    //   // normalize: check input_x count
    //
    //   var find_param = {
    //     'data_name': data_name
    //   };
    //   mongodb.collection('training_data').findOne(find_param, function(err, data){
    //     if (err) {
    //       console.log(err);
    //       callback(err);
    //       return;
    //     }
    //
    //     input_x_count = data.input_x_count;
    //     callback(null, 'ok');
    //   });
    // },
    // function(status, callback){
    //   // normalize: calculate std and mean
    //
    //   var agg_param = {
    //     _id: null,
    //     target_y_mean: {
    //       $avg: "$target_y"
    //     },
    //     target_y_stddev: {
    //       $stdDevPop: "$target_y"
    //     },
    //   };
    //
    //   for ( var i=0; i<input_x_count; i++) {
    //
    //     // mean
    //     var key_mean = "input_x_avg_"+i;
    //     var value_mean = {
    //       $avg: "$input_x_object."+i
    //     }
    //     agg_param[key_mean] = value_mean;
    //
    //     // std
    //     var key_std = "input_x_std_"+i;
    //     var value_std = {
    //       $stdDevPop: "$input_x_object."+i
    //     }
    //     agg_param[key_std] = value_std;
    //   }
    //
    //   console.log("agg_param: ", agg_param)
    //
    //   mongodb.collection('training_data').aggregate([
    //     {
    //       $match: {
    //         'data_name': data_name
    //       }
    //     },
    //     {
    //       $group: agg_param
    //     }
    //     ], function(err, data) {
    //     if (err){
    //       console.log("aggregate err: ", err);
    //       callback(err)
    //       rerturn;
    //     }
    //
    //     if (!data || data.length == 0) {
    //       callback("no mean and std");
    //       return;
    //     }
    //
    //     console.log("agg: ", data)
    //
    //     mean_and_std = data[0];
    //     callback(null, 'ok');
    //   });
    // },
    // function(status, callback){
    //   // normalize: update traiing data
    //
    //   // console.log("normalize start");
    //   // No, lets calculate mean and std at AI process
    //
    //   var find_param = {
    //     _id: data_name
    //   }
    //   var upd_param = {
    //     '$set':{
    //       mean_and_std: mean_and_std,
    //       updatedAt: new Date()
    //     }
    //   }
    //   mongodb.collection('data_models').update(find_param, upd_param, {upsert: true}, function(err){
    //     if (err){
    //       callback(err);
    //       return;
    //     }
    //     callback(null, 'ok');
    //   });
    // },
    function(status, callback){
      // update race

      var flg_name = data_name+"Flg";
      var find_param = {
        _id: race_id,
      };
      var upd_param = {}
      upd_param["$set"] = {}
      upd_param["$set"][flg_name] = true;
      mongodb.collection('N_RACE').update(find_param, upd_param, function(err){
        if (err){
          callback(err);
          return;
        }
        callback(null, 'ok');
      });
    }
  ], function (err, result) {
    if (err){
      console.log(err);
      cb(err);
    } else {
      console.log("success");
      cb();
    }
    return;
  });
}

var create_a_record = function(uma_0_info, uma_1_info, kyori, data_name, past_race_count, cb) {

  // uma_0
  // upcoming base of 0
  var upcoming_uma_0_odds = 0;
  var upcoming_uma_0_barei = 0;
  var upcoming_uma_0_futan = 0;
  var upcoming_uma_0_baTaijyu = 0;
  var upcoming_uma_0_zogenSa = 0;
  // upcoming Chokyosi & Kisyu of 1 years
  var upcoming_uma_0_ChokyosiCode_1 = 0;
  var upcoming_uma_0_KisyuCode_1 = 0;

  var past_uma_0_datalist = [];

  // uma_1
  // upcoming base of 1
  var upcoming_uma_1_odds = 0;
  var upcoming_uma_1_barei = 0;
  var upcoming_uma_1_futan = 0;
  var upcoming_uma_1_baTaijyu = 0;
  var upcoming_uma_1_zogenSa = 0;
  // upcoming Chokyosi & Kisyu of 1 years
  var upcoming_uma_1_ChokyosiCode_1 = 0;
  var upcoming_uma_1_KisyuCode_1 = 0;

  var past_uma_1_datalist = [];


  // x: kyori is base
  var input_x = [
    kyori,
  ];

  // y
  var target_y = 0;

  // processing...
  async.waterfall([
    function(callback){
      // uma_0 base info of upcoming race

      upcoming_uma_0_odds = uma_0_info._odds;
      upcoming_uma_0_barei = uma_0_info._barei;
      upcoming_uma_0_futan = uma_0_info._futan;
      upcoming_uma_0_baTaijyu = uma_0_info._baTaijyu;
      upcoming_uma_0_zogenSa = uma_0_info._zogenSa;
      if (uma_0_info.ZogenFugo == "-") {
        upcoming_uma_0_zogenSa = -1 * upcoming_uma_0_zogenSa;
      }

      callback(null, 'ok');
    },
    function(status, callback){
      // Chokyosi

      var ChokyosiCode = uma_0_info.ChokyosiCode;

      // 1 years
      var one_years_before = new Date(uma_0_info.race_date.getTime() - 1 * 365 * 24 * 60 * 60 * 1000)

      var find_param = {
        ChokyosiCode: ChokyosiCode,
        race_date:{
          '$lt':uma_0_info.race_date,
          '$gt':one_years_before
        }
      }
      mongodb.collection('N_UMA_RACE').find(find_param).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        if (data.length == 0){
          callback("no ChokyosiCode record");
          return;
        }

        var rentai_count = 0;
        for (var i=0; i<data.length; i++){
          if ( data[i]._kakuteiJyuni < 3 ) {
            rentai_count = rentai_count + 1;
          }
        }

        upcoming_uma_0_ChokyosiCode_1 = rentai_count / data.length

        callback(null, 'ok')
      });
    },
    function(status, callback){
      // Kisyu

      var KisyuCode = uma_0_info.KisyuCode;

      // 1 years
      var one_years_before = new Date(uma_0_info.race_date.getTime() - 1 * 365 * 24 * 60 * 60 * 1000)

      var find_param = {
        KisyuCode: KisyuCode,
        race_date:{
          '$lt':uma_0_info.race_date,
          '$gt':one_years_before
        }
      }
      mongodb.collection('N_UMA_RACE').find(find_param).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        if (data.length == 0){
          callback("no ChokyosiCode record");
          return;
        }

        var rentai_count = 0;
        for (var i=0; i<data.length; i++){
          if ( data[i]._kakuteiJyuni < 3 ) {
            rentai_count = rentai_count + 1;
          }
        }

        upcoming_uma_0_KisyuCode_1 = rentai_count / data.length

        callback(null, 'ok')
      });
    },
    function(status, callback){
      // past data

      var find_param = {
        KettoNum: uma_0_info.KettoNum,
        race_date:{
          '$lt':uma_0_info.race_date
        }
      }
      var sort_param = {
        race_date: -1
      }
      // past_race_count
      mongodb.collection('N_UMA_RACE').find(find_param).sort(sort_param).limit(past_race_count).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        if (data.length < past_race_count){
          callback("no past race record");
          return;
        }

        async.eachSeries(data, function(item, callback1) {

          get_raceinfo_for_one(item, function(err, data){

            past_uma_0_datalist.push(data);

            callback1();
          })

        }, function(){
          callback(null, 'ok')
        });
      });
    },
    function(callback, callback){
      // uma_1 base info of upcoming race

      upcoming_uma_1_odds = uma_1_info._odds;
      upcoming_uma_1_barei = uma_1_info._barei;
      upcoming_uma_1_futan = uma_1_info._futan;
      upcoming_uma_1_baTaijyu = uma_1_info._baTaijyu;
      upcoming_uma_1_zogenSa = uma_1_info._zogenSa;
      if (uma_1_info.ZogenFugo == "-") {
        upcoming_uma_1_zogenSa = -1 * upcoming_uma_1_zogenSa;
      }

      callback(null, 'ok');
    },
    function(status, callback){
      // uma_1 Chokyosi

      var ChokyosiCode = uma_1_info.ChokyosiCode;

      // 1 years
      var one_years_before = new Date(uma_1_info.race_date.getTime() - 1 * 365 * 24 * 60 * 60 * 1000)

      var find_param = {
        ChokyosiCode: ChokyosiCode,
        race_date:{
          '$lt':uma_1_info.race_date,
          '$gt':one_years_before
        }
      }
      mongodb.collection('N_UMA_RACE').find(find_param).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        if (data.length == 0){
          callback("no ChokyosiCode record");
          return;
        }

        var rentai_count = 0;
        for (var i=0; i<data.length; i++){
          if ( data[i]._kakuteiJyuni < 3 ) {
            rentai_count = rentai_count + 1;
          }
        }

        upcoming_uma_1_ChokyosiCode_1 = rentai_count / data.length

        callback(null, 'ok')
      });
    },
    function(status, callback){
      // Kisyu

      var KisyuCode = uma_1_info.KisyuCode;

      // 1 years
      var one_years_before = new Date(uma_1_info.race_date.getTime() - 1 * 365 * 24 * 60 * 60 * 1000)

      var find_param = {
        KisyuCode: KisyuCode,
        race_date:{
          '$lt':uma_1_info.race_date,
          '$gt':one_years_before
        }
      }
      mongodb.collection('N_UMA_RACE').find(find_param).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        if (data.length == 0){
          callback("no ChokyosiCode record");
          return;
        }

        var rentai_count = 0;
        for (var i=0; i<data.length; i++){
          if ( data[i]._kakuteiJyuni < 3 ) {
            rentai_count = rentai_count + 1;
          }
        }

        upcoming_uma_1_KisyuCode_1 = rentai_count / data.length

        callback(null, 'ok')
      });
    },
    function(status, callback){
      // past data

      var find_param = {
        KettoNum: uma_1_info.KettoNum,
        race_date:{
          '$lt':uma_1_info.race_date
        }
      }
      var sort_param = {
        race_date: -1
      }
      mongodb.collection('N_UMA_RACE').find(find_param).sort(sort_param).limit(past_race_count).toArray(function(err, data) {
        if (err){
          callback(err);
          return;
        }

        if (data.length < past_race_count){
          callback("no past race record");
          return;
        }

        async.eachSeries(data, function(item, callback1) {

          get_raceinfo_for_one(item, function(err, data){

            past_uma_1_datalist.push(data);

            callback1();
          })

        }, function(){
          callback(null, 'ok')
        });
      });
    },
    function(status, callback){
      // x, y

      // // kyori is base
      // var input_x = [
      //   kyori,
      // ];

      // X

      // uma_0
      var upcoming_uma_0_basic = [
        upcoming_uma_0_odds,
        upcoming_uma_0_barei,
        upcoming_uma_0_futan,
        upcoming_uma_0_baTaijyu,
        upcoming_uma_0_zogenSa,
      ];
      input_x = input_x.concat(upcoming_uma_0_basic)

      var upcoming_uma_0_Chokyosi = [
        upcoming_uma_0_ChokyosiCode_1,
      ];
      input_x = input_x.concat(upcoming_uma_0_Chokyosi)

      var upcoming_uma_0_KisyuCode = [
        upcoming_uma_0_KisyuCode_1
      ];
      input_x = input_x.concat(upcoming_uma_0_KisyuCode)

      for (var i=0; i<past_uma_0_datalist.length; i++){
        console.log("-- past_uma_0_datalist --: "+i)
        input_x = input_x.concat(past_uma_0_datalist[i])
      }

      // uma_1
      var upcoming_uma_1_basic = [
        upcoming_uma_1_odds,
        upcoming_uma_1_barei,
        upcoming_uma_1_futan,
        upcoming_uma_1_baTaijyu,
        upcoming_uma_1_zogenSa,
      ];
      input_x = input_x.concat(upcoming_uma_0_basic)

      var upcoming_uma_1_Chokyosi = [
        upcoming_uma_1_ChokyosiCode_1,
      ];
      input_x = input_x.concat(upcoming_uma_1_Chokyosi)

      var upcoming_uma_1_KisyuCode = [
        upcoming_uma_1_KisyuCode_1
      ];
      input_x = input_x.concat(upcoming_uma_1_KisyuCode)

      for (var i=0; i<past_uma_1_datalist.length; i++){
        input_x = input_x.concat(past_uma_1_datalist[i])
      }

      // Y
      target_y = uma_1_info._time - uma_0_info._time;


      // create object
      var input_x_object = {};
      for (var i=0; i<input_x.length; i++){
        input_x_object[i] = input_x[i];
      }

      console.log("input_x_object: ",input_x_object)
      console.log("target_y: ", target_y)

      //
      // insert
      //

      // var data_name = 'past_1day_with_odds';

      var training_data_id = data_name+"-"+uma_0_info.race_id+uma_0_info.KettoNum+uma_1_info.KettoNum;

      // find one
      var find_param = {
        _id: training_data_id,
      };
      mongodb.collection('training_data_'+data_name).findOne(find_param, function(err, data){
        if (err){
          console.log(err)
          callback(err)
          return;
        }

        if (data){
          console.log("training data already exist");
          callback("training data already exist")
          return;
        } else {
          var insert_param = {
            _id: training_data_id,
            data_name: data_name,
            input_x: input_x,
            target_y: target_y,
            input_x_object:input_x_object,
            input_x_count: input_x.length,
            createdAt: new Date(),
            normalized: false,
          };
          mongodb.collection('training_data_'+data_name).insert(insert_param, function(err){
            if (err){
              console.log(err)
              callback(err)
              return;
            }
            callback(null, 'ok')
          })
        }
      })
    }
  ], function (err, result) {
    if (err){
      console.log(err);
      cb(err);
      return;
    }

    // return input_x, target_y to calculate mean and std
    cb(null, input_x.length)

  });

}

var get_raceinfo_for_one = function( uma_race_info, cb ) {

  // past
  var past_uma_odds = uma_race_info._odds;
  var past_uma_barei = uma_race_info._barei;
  var past_uma_futan = uma_race_info._futan;
  var past_uma_baTaijyu = uma_race_info._baTaijyu;
  var past_uma_zogenSa = uma_race_info._zogenSa;
  if (uma_race_info.ZogenFugo == "-"){
    past_uma_zogenSa = -1 * past_uma_zogenSa;
  }
  var past_uma_timeDiff = uma_race_info._timeDiff;
  var past_uma_haronTimeL3 = uma_race_info._haronTimeL3;
  var past_uma_time = uma_race_info._time;
  var past_uma_kakuteiJyuni = uma_race_info._kakuteiJyuni;

  var find_param = {
    _id: uma_race_info.race_id
  }
  mongodb.collection('N_RACE').findOne(find_param, function(err, data){
    if (err){
      console.log("get_raceinfo_for_one, kyori, err: ", err);
      cb(err);
    } else {

      if (!data){
        console.log("no such race");
        cb("no such race");
        return;
      }

      var kyori = data._kyori

      var list = [
        past_uma_odds,
        past_uma_barei,
        past_uma_futan,
        past_uma_baTaijyu,
        past_uma_zogenSa,
        past_uma_timeDiff,
        past_uma_haronTimeL3,
        // past_uma_time,
        past_uma_kakuteiJyuni,
        kyori
      ];

      cb(null, list)
    }
  });
}


// calculate mean and std
var calculate_mean_and_std = function(data_name){

  console.log("======================================");
  console.log("= start "+new Date()+" =");
  console.log("======================================");

  // var max_count = 4000000000;
  // // var max_count = 1;
  // var go_next = null;
  // var count = 0;

  var input_x_count = 0;
  var mean_and_std = null;

  // processing...
  async.waterfall([
    function(callback){
      // normalize: check input_x count

      var find_param = {
        'data_name': data_name
      };
      mongodb.collection('training_data_'+data_name).findOne(find_param, function(err, data){
        if (err) {
          console.log(err);
          callback(err);
          return;
        }

        input_x_count = data.input_x_count;
        callback(null, 'ok');
      });
    },
    function(status, callback){
      // normalize: calculate std and mean

      var agg_param = {
        _id: null,
        target_y_mean: {
          $avg: "$target_y"
        },
        target_y_stddev: {
          $stdDevPop: "$target_y"
        },
      };

      for ( var i=0; i<input_x_count; i++) {

        // mean
        var key_mean = "input_x_avg_"+i;
        var value_mean = {
          $avg: "$input_x_object."+i
        }
        agg_param[key_mean] = value_mean;

        // std
        var key_std = "input_x_std_"+i;
        var value_std = {
          $stdDevPop: "$input_x_object."+i
        }
        agg_param[key_std] = value_std;
      }

      console.log("agg_param: ", agg_param)

      mongodb.collection('training_data_'+data_name).aggregate([
        {
          $match: {
            'data_name': data_name
          }
        },
        {
          $group: agg_param
        }
        ], function(err, data) {
        if (err){
          console.log("aggregate err: ", err);
          callback(err)
          rerturn;
        }

        if (!data || data.length == 0) {
          callback("no mean and std");
          return;
        }

        console.log("agg: ", data)

        mean_and_std = data[0];
        callback(null, 'ok');
      });
    },
    function(status, callback){
      // normalize: update traiing data

      // console.log("normalize start");
      // No, lets calculate mean and std at AI process

      var find_param = {
        _id: data_name
      }
      var upd_param = {
        '$set':{
          mean_and_std: mean_and_std,
          updatedAt: new Date()
        }
      }
      mongodb.collection('data_models_'+data_name).update(find_param, upd_param, {upsert: true}, function(err){
        if (err){
          callback(err);
          return;
        }
        callback(null, 'ok');
      });
    },
  ], function (err, result) {

    if (err){
      console.log(err);
    } else {
      console.log("======================================");
      console.log("= end "+new Date()+" =");
      console.log("======================================");
    }

    // console.log("total ok_count:"+ok_count+", ng_count:"+ng_count);

    process.kill(process.pid, 'SIGHUP');

  });
}


//
// update_random_index
//

// start update_random_index traiing data
var update_random_index = function(){

  console.log("======================================");
  console.log("= start "+new Date()+" =");
  console.log("======================================");

  var max_count = 4000000000;
  // var max_count = 1;
  var go_next = null;
  var count = 0;

  // processing...
  async.waterfall([
    function(callback){
      // loop
      async.whilst(
        function () {

          // check_articles_err
          if (go_next != null){
            return false;
          } else {
            return true;
          }
        },
        function (callback1) {

          assign_random_index_each( count, function(err){

            count++;

            if (err){
              console.log(err);
              go_next = err;
            }

            if (count > max_count){
              go_next = "reached "+max_count;
            }

            callback1();
          });
        },
        function (err, n) {
          // 5 seconds have passed, n = 5
          callback(null, 'ok');
        }
      );
    }
  ], function (err, result) {

    if (err){
      console.log(err);
    } else {
      console.log("======================================");
      console.log("= end "+new Date()+" =");
      console.log("======================================");
    }

    // console.log("total ok_count:"+ok_count+", ng_count:"+ng_count);

    process.kill(process.pid, 'SIGHUP');
  });
}
var assign_random_index_each = function(count, cb){

  var list = [];

  var limit = 1000;
  var offset = count * limit;

  // processing...
  async.waterfall([
    function(callback){

      var find_param = {
        'random_index': 0
      };
      mongodb.collection('training_data_Kisyu_Kyusya_1_race_5_with_odds').find(find_param).limit(limit).toArray(function(err, data) {
        if (err) {
          callback(err);
          return;
        }
        if (!data || data.length == 0){
          callback('no more data 2');
          return;
        }

        list = data;
        callback(null, 'ok');
      });
    },
    function(status, callback){

      async.eachSeries(list, function(item, callback1){

        var random_index = Math.floor(Math.random() * 100) + 1;

        var find_param = {
          '_id': item._id,
        }
        var upd_param = {
          '$set':{
            'random_index':random_index
          }
        }
        mongodb.collection('training_data_Kisyu_Kyusya_1_race_5_with_odds').update(find_param, upd_param, function(err){
          if (err){
            console.log(err);
          }
          callback1(null, 'ok');
        });

      }, function(){
        callback(null, 'ok');
      });
    }
  ], function (err, result) {
    if (err){
      console.log(err);
      cb(err);
    } else {
      console.log("success");
      cb();
    }
    return;
  });
};
















// convert sqlite.N_UMA_RACE into mongo.dl_n_uma_race
if (!process.argv[2]){
  console.log("please set command");
  return;
}
var command_form_argv = process.argv[2];
if (command_form_argv == "start_insert_sqlite_data") {
  start_insert_sqlite_data()
} else if (command_form_argv == "start_insert_race_data") {
  start_insert_race_data();
} else if (command_form_argv == "update_random_index") {
  update_random_index();
} else {
  start_create_training_data("Kisyu_Kyusya_1_race_5_with_odds", 5)
}
