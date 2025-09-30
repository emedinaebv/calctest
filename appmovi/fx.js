function checkValuesInColumn(column, values) {

  let $return = false;
  _.each(values, (v) => {
    if (column.indexOf(v) >= 0) {
      $return = true;
    }
  });
  return $return;
}

function setupBI(db) {
// console.log("db at start of setupBI:", db);
  // db.data.PARAMS.push({
  //   ID: 20000,
  //   NAME: "Clase social",
  // });

  db.data.VALUES.push({
    ID: 20001,
    NAME: "Bajo/a",
  });
  db.data.VALUES.push({
    ID: 20002,
    NAME: "Medio/a - Bajo/a",
  });
  db.data.VALUES.push({
    ID: 20003,
    NAME: "Medio/a",
  });
  db.data.VALUES.push({
    ID: 20004,
    NAME: "Medio/a - Alto/a",
  });
  db.data.VALUES.push({
    ID: 20005,
    NAME: "Alto/a",
  });
  //console.log("db after pushing VALUES:", db);
  db.data.DATA = _.map(db.data.DATA, (row) => {
    let lvl = 100,
      a = row[1],
      b = row[2],
      c = checkValuesInColumn;

    if (c(a, [2])) {
      lvl = 20001;
    } else if (c(a, [2]) ) {
      lvl = 20002;
    }
     else if (
      (c(a, [1]) ) 
    ) {
      lvl = 20003;
    } else if  (c(a, [2]))  {
      lvl = 20004;
    } else if  (c(a, [2]) )  {
      lvl = 20005;
    }
    row[20000] = [lvl];
    return row;
  });
 // console.log("db at end of setupBI:", db);
  return db;
}

window.fx = {
  chart: null,
  getNextColor: function (label, usedColors, pattern = null) {
    if (typeof label.COLOR !== "undefined") {
      return label.COLOR;
    }
    let color_schema = app.color_schema.split("."),
      colors = pattern
        ? pattern
        : Chart.colorschemes[color_schema[0]][color_schema[1]];
    return colors[_.size(usedColors)];
  },
  allowedValue: function (value) {
    let chart = this.chart.content;
    return (
      typeof chart.blacklist === "undefined" ||
      chart.blacklist.indexOf(value) < 0
    );
  },
  virtualPercent: function (column, options) {
    let that = this,
      fdata = app.data.filter((row) => row[column][0] !== 0),
      fdata_size = _.size(fdata),
      vdata = app.data.filter((row) => options.indexOf(row[column][0]) >= 0),
      vdata_size = _.size(vdata);
    return fdata_size == 0 || vdata_size == 0
      ? 0
      : Math.round(((vdata_size * 100) / fdata_size) * 10) / 10;
  },
  fCount: function (conditions, fdata) {
    let that = this;
    if (typeof fdata === "undefined") {
      fdata = app.data;
    }
    _.each(conditions, (values, col) => {
      if (col == 1) {
        fdata = fdata.filter((row) => values.indexOf(row[col]) >= 0);
      } else {
        fdata = fdata.filter((row) => {
          _.each(values, (value) => {
            if (row[col].indexOf(value) >= 0) {
              return true;
            }
          });
          return false;
        });
      }
    });
    return _.size(fdata);
  },
  dataset2table(dataset) {
    let titles = [],
      rows = {
        "": [],
      };
    _.each(dataset[1], (title) => {
      rows[""].push("<b>" + title + "</b>");
    });
    _.each(dataset[0], (rowdata) => {
      rows[rowdata.label] = rowdata.data.map(
        (v) => parseInt(parseFloat(v.toString()) * 1000) / 1000 + " %"
      );
    });
    return [titles, rows];
  },
  getPosibleValues(column) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data,
      values = [];
    _.each(data, (row, row_index) => {
      values = _.concat(values, row[column]);
    });
    return _.uniq(values);
  },
  prepareDatasetByBMBMMM(dataset) {

  

    let groups = [
        {
          label: "Insuficiente",
          datasets: [1,2,3,4],
        },
        {
          label: "Suficiente",
          datasets: [5],
          color: "#F3AC0D",
        },
        {
          label: "Bien",
          datasets: [6],
          color: "#ff0000",
        },
        {
          label: "Notable",
          datasets: [7,8],
          color: "#969696",
        },
        {
          label: "Sobresaliente",
          datasets: [9,10],
          color: "#E619B4",
        },
      ],
      datasets = [];
    _.each(groups, (g) => {
      let new_dataset = {
        label: g.label,
        data: [],
      };
      if (typeof g.color !== "undefined") {
        new_dataset.backgroundColor = g.color;
      }
      _.each(g.datasets, (i) => {
        let _dataset = dataset[0][i];
        if (typeof _dataset !== "undefined") {
          _.each(_dataset.data, (v, j) => {
            if (typeof new_dataset.data[j] == "undefined") {
              new_dataset.data[j] = 0;
            }
            new_dataset.data[j] += v;
          });
        }
      });
      datasets.push(new_dataset);
    });
    dataset[0] = datasets;
    return dataset;
  },

  getDatasetByBMBMMM(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(this.getDatasetBy(column, groupedBy));
  },
  getDatasetGlobalByBMBMMM(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(
      this.getDatasetGlobalBy(column, groupedBy)
    );
  },
  getDatasetByBMBMMM2(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(this.getDatasetBy2(column, groupedBy));
  },
  getDatasetGlobalByBMBMMM2(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(
      this.getDatasetGlobalBy2(column, groupedBy)
    );
  },
  getDatasetByBMBMMM3(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(this.getDatasetBy3(column, groupedBy));
  },
  getDatasetGlobalByBMBMMM2(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(
      this.getDatasetGlobalBy2(column, groupedBy)
    );
  },
  getDatasetBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
   //   console.log("getDatasetBy called with column:", column, "groupedBy:", groupedBy);
   //   console.log("data:", data);
    return this.prepareDataset(data, column, groupedBy);
  },
  getDatasetGlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDataset(data, column, groupedBy, true);
  },
  prepareDataset(data, column, groupedBy, globalData) {
 //   console.log("prepareDataset called with data:", data);
 //   console.log("prepareDataset called with column:", column);
   // console.log("prepareDataset called with groupedBy:", groupedBy);

    globalData = typeof globalData == "undefined" ? false : globalData;

    let that = this,
      biggest_val = 0,
      datasets = [],
      labels = [],
      cache = {
        labels: {},
        values: {},
        groups: {},
        groups_values: {},
        used_colors: [],
        max: 0,
      },
      options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [],
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return 0;
              },
            },
          },
          datalabels: false,
        },
      };

    _.each(data, (row, row_index) => {
 //  console.log("processing row in prepareDataset:", row);
      let values_checker = [];
      _.each(row[groupedBy], (group) => {
        _.each(row[column], (value) => {
          if (typeof cache.labels[value] === "undefined") {
            let v = app.db.VALUES.find((row) => row.ID + "" === value + "");
            if (typeof v === "undefined") {       
              cache.labels[value] = value;
            } else {
             
              cache.labels[value] = v.NAME;
            }
          }
          if (typeof cache.groups[group] === "undefined") {
            cache.groups[group] = 0;
          }
          if (typeof cache.values[value] === "undefined") {
            cache.values[value] = 0;
          }
          if (typeof cache.groups_values[group] === "undefined") {
            cache.groups_values[group] = {};
          }
          if (typeof cache.groups_values[group][value] === "undefined") {
            cache.groups_values[group][value] = 0;
          }
          cache.groups[group]++;
          if (values_checker.indexOf(value) < 0) {
            cache.values[value]++;
            values_checker.push(value);
          }
          cache.groups_values[group][value]++;
        });
      });
    });

    _.each(cache.groups, (group, group_id) => {
   //   console.log("group:", group, "groupName:", app.db.VALUES.find((row) => "" + row.ID === "" + group_id).NAME);
      labels.push(
        app.db.VALUES.find((row) => "" + row.ID === "" + group_id).NAME
      );
    });


    _.each(cache.values, (value_max, value_id) => {
      let value_obj = app.db.VALUES.find(
        (row) => "" + row.ID === "" + value_id
      );
    //  console.log("value_id:", value_id, "value_obj:", value_obj);
    
      if (typeof value_obj === "undefined") {
        value_obj = {
          ID: value_id,
          NAME: value_id,
        };
   
      }
    
      let dataset = {
        label: value_obj.NAME,
        data: [],
        backgroundColor: that.getNextColor(value_obj, cache.used_colors),
      };
  
      cache.used_colors.push(dataset.backgroundColor);
      _.each(cache.groups_values, (values, group) => {
        let value =
          typeof values[value_id] === "undefined" ? 0 : values[value_id];
        if (!globalData) {
          biggest_val = 100;
          value = value ? (value / cache.groups[group]) * 100 : 0;
        } else {
          value = value ? (value / _.size(data)) * 100 : 0;
          if (value > 0) {
            let _tmp = Math.ceil(value / 10) * 10;
            if (_tmp > biggest_val) {
              biggest_val = _tmp;
            }
          }
        }
        value = value ? Math.round(value * 100) / 100 : 0;
        dataset.data.push(value);
      });
 //     console.log("dataset created:", dataset);
      datasets.push(dataset);
    });

    options.scales.yAxes = [
      {
        ticks: {
          beginAtZero: true,
          suggestedMax: biggest_val,
          stepSize: biggest_val / 5,
          callback: function (value, index, values) {
            return value + "%";
          },
        },
      },
    ];

    let _return = [datasets, labels, options];

  
    return _return;
  },
  getDatasetBy2(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    data = data.filter((row) => row["0"].indexOf(column) >= 0);
    return this.prepareDataset(data, column, groupedBy);
  },
  getDatasetGlobalBy2(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    data = data.filter((row) => row["0"].indexOf(column) >= 0);
    return this.prepareDataset(data, column, groupedBy, true);
  },
  getDatasetBy3(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    data = data.filter((row) => row["11"].indexOf(20) >= 0);
    return this.prepareDataset(data, column, groupedBy);
  },
  getDatasetGlobalBy3(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    data = data.filter((row) => row["11"].indexOf(20) >= 0);
    return this.prepareDataset(data, column, groupedBy, true);
  },
  tablaencuestados(value) {
    let fdata = app.data;
    let titulos = ["tipo"];
    let datos = {};

    if (value == 11) {
      datos = {
        "Isla": [
          _.size(fdata.filter((row) => row[value] == 63)),
          _.size(fdata.filter((row) => row[value] == 64)),
          _.size(fdata.filter((row) => row[value] == 65)),
          _.size(fdata.filter((row) => row[value] == 66)),
          _.size(fdata.filter((row) => row[value] == 67)),
          _.size(
            fdata.filter(
              (row) =>
                row[value] == 63 ||
                row[value] == 64 ||
                row[value] == 65 ||
                row[value] == 66 ||
                row[value] == 67 ||
                row[11]
            )
          ),
        ],
      };
    }
    if (value == 4) {
      datos = {


        "Coche de gasolina/ gasoil": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 51 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 51 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 51 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 51 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 51 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],



        "Coche eléctrico o híbrido": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 52 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 52 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 52 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 52 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 52 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],


        "Moto eléctrica": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 53 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 53 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 53 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 53 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 53 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],


        "Moto gasolina": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 54 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 54 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 54 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 54 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 54 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],



        "Bus / Guagua": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 55 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 55 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 55 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 55 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 55 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],



        "Tranvía": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 56 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 56 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 56 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 56 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 56 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],

        "Bicicleta o patinete": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 57 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 57 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 57 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 57 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 57 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],
         "Bicicleta eléctrica o patinete eléctrico": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 58 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 58 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 58 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 58 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 58 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],
         "A pie": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 59 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 59 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 59 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 59 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 59 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],


      };
    }
    if (value == 12) {
      datos = {


        "HiperDino": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 68 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 68 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 68 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 68 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 68 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],



        "HiperDino Express": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 69 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 69 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 69 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 69 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 69 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],


        "Logística": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 73 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 73 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 73 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 73 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 73 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],


        "Oficina": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 72 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 72 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 72 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 72 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 72 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],



        "Online": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 71 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 71 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 71 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 71 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 71 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],



        "SuperDino": [
          // Suma de row[2] para cada filtro
          fdata
            .filter((row) => row[value] == 70 && row[11] == 63)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 70 && row[11] == 64)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 70 && row[11] == 65)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 70 && row[11] == 66)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
          fdata
            .filter((row) => row[value] == 70 && row[11] == 67)
            .reduce((sum, row) => sum + Number(row[2] * (row[3]*2)* row[13] || 0), 0),
        ],


      };
    }
    

    return {
      titulos: titulos,
      datos: datos,
    };
  },
  inform: function (inform, db) {
    let that = this,
 
     blacklist = [0,1,13],
      modes = {
        "Año": 1,
        "Por Isla": 11,
        "Por tipo de local": 12,
      
      };
    _.each(db.PARAMS, (param) => {
      if (blacklist.indexOf(param.ID) < 0) {
        let contents = [];
        _.each(modes, (mode, mode_name) => {
          _.each(["Por grupo"], (submode) => {
            contents.push({
              type: "col",
              content: [
                {
                  type: "card",
                  header:
                    mode_name +
                    ' <span style="color: ' +
                    (submode == "Global" ? "red" : "green") +
                    ';">(' +
                    submode +
                    ")</span>",
                  class: "mb-3",
                  height: 200,
                  content: [
                    {
                      type: "chart",
                      chart: "bar",
                      blacklist: [0],
                      data: [
                        `[datasets, labels, options] = fx.getDataset` +
                          (submode == "Global" ? "Global" : "") +
                          `By(` +
                          param.ID +
                          `, ` +
                          mode +
                          `);`,
                        `options.title = {};`,
                      ],
                      config: {
                        labels: [
                          {
                            render: "percentage",
                            fontColor: ["black"],
                          },
                        ],
                        tooltips: {
                          label: "",
                          title: "",
                        },
                        legend: {
                          position: "left",
                        },
                      },
                    },

                    {
                      type: "table",
                      blacklist: [0],
                      data: [
                        `$return = fx.dataset2table(fx.getDataset` +
                          (submode == "Global" ? "Global" : "") +
                          `By(` +
                          param.ID +
                          `, ` +
                          mode +
                          `));`,
                        `table.content.titles = $return[0];`,
                        `$return = $return[1];`,
                      ],
                      config: {
                        labels: [
                          {
                            render: "percentage",
                            fontColor: ["black"],
                          },
                        ],
                        tooltips: {
                          label: "",
                          title: "",
                        },
                        legend: {
                          position: "left",
                        },
                      },
                    },         
                  ],
                },
              ],
            });
          });
        });

        inform.pages.push({
          name: param.NAME,
          filters: [],
          content: contents,
        });

      }
    });


    return inform;
  },
};
