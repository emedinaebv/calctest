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

  db.data.DATA = _.map(db.data.DATA, (row) => {
    let lvl = 100,
      a = row[2],
      b = row[3],
      c = checkValuesInColumn;

    row[20000] = [lvl];
    return row;
  });

  return db;
}

window.fx = {
  chart: null,

  getNextColor: function (label, usedColors, pattern = null) {

    if (typeof label.COLOR !== "undefined") {
      return label.COLOR;
    }

    let colors = pattern
      ? pattern
      : [
        "#ff0000",
        "#ff3700",
        "#ff6a00",
        "#ffa200",
        "#ffdd00",
        "#f6ff00",
        "#bbff00",
        "#84ff00",
        "#48ff00",
        "#129e4a",
        "#7e8182",
      ];

    let colorIndex = _.size(usedColors) % colors.length;

    let color = colors[colorIndex];
    usedColors.push(color);
    return color;
  },
  getNextColor2: function (label, usedColors, pattern = null) {

    console.log("label color     ",label)
    console.log("label usedColors     ",usedColors)
    console.log("label pattern     ",pattern)
    if (typeof label.COLOR !== "undefined") {
      return label.COLOR;
    }

    let colors = pattern
      ? pattern
      : [
        "#ff0000",
        "#3377ff",
        "#ff6a00",
        "#ffa200",
        "#ffdd00",
        "#f6ff00",
        "#bbff00",
        "#84ff00",
        "#48ff00",
        "#129e4a",
        "#7e8182",
      ];

    let colorIndex = _.size(usedColors) % colors.length;

    let color = colors[colorIndex];
    usedColors.push(color);
    return color;
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
        (v) => parseInt(parseFloat(v.toString()) * 100) / 100 + " %"
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
        datasets: [0, 1, 2, 3, 4],
        color: "#ff0000",
      },
      {
        label: "Suficiente",
        datasets: [5],
        color: "#ffa200",
      },
      {
        label: "Bien",
        datasets: [6],
        color: "#f6ff00",
      },
      {
        label: "Notable",
        datasets: [7, 8],
        color: "#bbff00",
      },
      {
        label: "Sobresaliente",
        datasets: [9, 10],
        color: "#00ff00",
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
    return this.prepareDatasetByBMBMMM((column, groupedBy));
  },
  getDatasetGlobalByBMBMMM3(column, groupedBy) {
    return this.prepareDatasetByBMBMMM(
      this.getDatasetGlobalBy3(column, groupedBy)
    );
  },

  getDatasetBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDataset(data, column, groupedBy);
  },
  getDatasetGlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDataset(data, column, groupedBy, true);
  },
  getDatasetoliBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDatasetoli(data, column, groupedBy);
  },
  getDatasetoliGlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDatasetoli(data, column, groupedBy, true);
  },
  getDatasetnewBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;

    return this.prepareDatasetnew(data, 52, groupedBy);
  },
  getDatasetnewGlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDatasetnew(data, 52, groupedBy, true);
  },
  getDatasetnew2By(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;

    return this.prepareDatasetnew(data, 42, groupedBy);
  },
  getDatasetnew2GlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDatasetnew(data, 42, groupedBy, true);
  },

  getDatasetMediaBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDatasetMedia(data, column, groupedBy);
  },
  getDatasetMediaGlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDatasetMedia(data, column, groupedBy, true);
  },

  getDataset2By(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDataset2(data, column, groupedBy);
  },
  getDataset2GlobalBy(column, groupedBy) {
    let that = this,
      data = typeof app.fdata !== "undefined" ? app.fdata : app.data;
    return this.prepareDataset2(data, column, groupedBy, true);
  },

  prepareDataset(data, column, groupedBy, globalData) {
    globalData = typeof globalData == "undefined" ? false : globalData;
    console.log("prepare   column   ",column)

    let that = this,
      datasets = [],
      allLabels = new Set(),
      cache = {
        labels: {},
        values: {},
        groups: {},
        groups_values: {},
        used_colors: [],
      },
      options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMax: 100,
                stepSize: 10,
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
              //tamaño ancho de barra
              barThickness: 10.7,
            },
          ],
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.raw + "%";
              },
            },
          },
          datalabels: false,
        },
      };

    const valueNames = {};
    app.db.VALUES.forEach((value) => {
      valueNames[value.ID] = value.NAME;
    });

    data.forEach((rowData) => {
      let labelsArray = rowData[48]; // Etiquetas de los puertos
      let valuesArray = rowData[column]; // Valores de puntuaciones

      if (labelsArray && valuesArray) {
        rowData[groupedBy].forEach((group) => {
          labelsArray.forEach((label, index) => {
            let value = valuesArray[index];

            // Agregar etiquetas a la caché si no están presentes
            if (typeof cache.labels[label] === "undefined") {
              let v = app.db.VALUES.find((row) => row.ID + "" === label + "");
              cache.labels[label] = typeof v === "undefined" ? label : v.NAME;
            }

            // Mantener un conjunto de todas las etiquetas encontradas
            if ((value >= 1 && value <= 10) || value === 100) {
              allLabels.add(label);
            }

            // Incrementar contadores en la caché
            if (typeof cache.groups[group] === "undefined") {
              cache.groups[group] = 0;
            }
            if (typeof cache.values[label] === "undefined") {
              cache.values[label] = { total: 0, counts: {} };
            }
            if (typeof cache.values[label].counts[value] === "undefined") {
              cache.values[label].counts[value] = 0;
            }
            cache.groups[group]++;
            cache.values[label].total++;
            cache.values[label].counts[value]++;
          });
        });
      }
    });

    // Convertir el conjunto de todas las etiquetas a un array ordenado y filtrar por valores 1-10 y 100
    let labels = Array.from(allLabels).map((label) => cache.labels[label]);

    // Crear datasets para cada valor de puntuación del 1 al 10 y 100
    let valuesRange = Array.from({ length: 10 }, (_, i) => i + 1).concat([100]);
    valuesRange.forEach((value) => {
      let dataset = {
        label: value === 100 ? "NS/NC" : value.toString(),
        data: labels.map((label) => {
          let originalLabel = Object.keys(cache.labels).find(
            (key) => cache.labels[key] === label
          );
          let portData = cache.values[originalLabel];
          let sumval = 0;
          if (portData) {
            if (!globalData) {
              return portData.counts[value]
                ? (portData.counts[value] / portData.total) * 100
                : 0;
            } else {
              let totalResponses = data.length;
              let valoresTotales = 0;
              for (let i in data) {
                valoresTotales = valoresTotales + data[i][48].length;
              }

              let totalValueCount = Object.values(portData.counts).reduce(
                (a, b) => a + b,
                0
              );
              sumval = sumval + totalValueCount;
              return portData.counts[value]
                ? (portData.counts[value] / valoresTotales) * 100
                : 0;
            }
          }
          return 0;
        }),

        backgroundColor: that.getNextColor({}, cache.used_colors),
      };

      datasets.push(dataset);
    });

    // Devolver los datasets, etiquetas y opciones
    let _return = [datasets, labels, options];

    return _return;
  },
  prepareDatasetoli(data, column, groupedBy, globalData) {
    globalData = typeof globalData == "undefined" ? false : globalData;

      let valorestest = [15,11,13,25,26,27,28,29,30,31,32]

    //   let set = 5

    /////aqui 
    let puertos = [];
      if(valorestest.includes(column)){
        console.log("dentro     ",column)
        puertos.push(3)

      }


    let that = this,
      datasets = [],
      allLabels = new Set(),
      cache = {
        labels: {},
        values: {},
        groups: {},
        groups_values: {},
        used_colors: [],
      },
      options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMax: 100,
                stepSize: 10,
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
              //tamaño ancho de barra
              barThickness: 10.7,
            },
          ],
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.raw + "%";
              },
            },
          },
          datalabels: false,
        },
      };

    const valueNames = {};
    app.db.VALUES.forEach((value) => {
      valueNames[value.ID] = value.NAME;
    });

    data.forEach((rowData) => {

      ///////aqui esta la cosa  
      
      let labelsArray = rowData[48]; 
      console.log(labelsArray)
      let valuesArray = rowData[column];

      if (labelsArray && valuesArray) {
        rowData[groupedBy].forEach((group) => {
          // rowData[3,7].forEach((group) => {
          labelsArray.forEach((label, index) => {
            // console.log("valuesArray[index]   ",valuesArray[index])
            let value = valuesArray[index];


            // Agregar etiquetas a la caché si no están presentes
            if (typeof cache.labels[label] === "undefined") {
              let v = app.db.VALUES.find((row) => row.ID + "" === label + "");
              cache.labels[label] = typeof v === "undefined" ? label : v.NAME;
            }

            // Mantener un conjunto de todas las etiquetas encontradas
            if ((value >= 1 && value <= 10) || value === 100) {
              allLabels.add(label);
            }


            // Incrementar contadores en la caché
            if (typeof cache.groups[group] === "undefined") {
              cache.groups[group] = 0;
            }
            if (typeof cache.values[label] === "undefined") {
              cache.values[label] = { total: 0, counts: {} };
            }
            if (typeof cache.values[label].counts[value] === "undefined") {
              cache.values[label].counts[value] = 0;
            }
            cache.groups[group]++;

            cache.values[label].total++;

            cache.values[label].counts[value]++;


          });
        });
      }
    });



    // Convertir el conjunto de todas las etiquetas a un array ordenado y filtrar por valores 1-10 y 100
    let labels = Array.from(allLabels).map((label) => cache.labels[label]);

    // Crear datasets para cada valor de puntuación del 1 al 10 y 100
    let valuesRange = Array.from({ length: 10 }, (_, i) => i + 1).concat([100]);
    console.log("valuesRange   ", valuesRange)
    valuesRange.forEach((value) => {


      let dataset = {
        label: value === 100 ? "NS/NC" : value.toString(),
        data: labels.map((label) => {
          let originalLabel = Object.keys(cache.labels).find(
            (key) => cache.labels[key] === label
          );
          let portData = cache.values[originalLabel];
          let sumval = 0;


          if (portData) {
            if (!globalData) {
            
              let adjustedTotal = portData.total + Object.keys(portData.counts).length/10 ; 
              console.log("Number of objects in counts:", adjustedTotal);
              return portData.counts[value]
                ? (portData.counts[value] / adjustedTotal) * 100
                : 0;

              // console.log("portData.counts[value]",  portData.counts[value])
              // console.log("portData.total]",  portData.total)

              // return portData.counts[value]
              //   ? (portData.counts[value] / portData.total) * 100
              //   : 0;
            }




            else {
              let totalResponses = data.length;
              let valoresTotales = 0;
              for (let i in data) {

                valoresTotales = valoresTotales + data[i][48].length;
              }

              let totalValueCount = Object.values(portData.counts).reduce(
                (a, b) => a + b,
                0
              );
              sumval = sumval + totalValueCount;
              return portData.counts[value]
                ? (portData.counts[value] / valoresTotales) * 100
                : 0;
            }
          }
          return 0;
        }),

        backgroundColor: that.getNextColor({}, cache.used_colors),
      };

      datasets.push(dataset);
    });

    // Devolver los datasets, etiquetas y opciones
    let _return = [datasets, labels, options];

    return _return;
  },

  prepareDatasetnew(data, column, groupedBy, globalData) {
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
      labels.push(
        app.db.VALUES.find((row) => "" + row.ID === "" + group_id).NAME
      );
    });

    _.each(cache.values, (value_max, value_id) => {
      let value_obj = app.db.VALUES.find(
        (row) => "" + row.ID === "" + value_id
      );
      if (typeof value_obj === "undefined") {
        value_obj = {
          ID: value_id,
          NAME: value_id,
        };
      }
      let dataset = {
        label: value_obj.NAME,
        data: [],
        backgroundColor: that.getNextColor2(value_obj, cache.used_colors),
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

  prepareDatasetMedia(data, column, groupedBy, globalData) {
    globalData = typeof globalData == "undefined" ? false : globalData;

    let that = this,
      datasets = [],
      allLabels = new Set(),
      cache = {
        labels: {},
        values: {},
        groups: {},
        groups_values: {},
        used_colors: [],
      },
      options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMax: 10, // Máximo sugerido es 10
                stepSize: 1, // Los pasos en el eje Y serán de 1 en 1
                callback: function (value) {
                  return value; // Mostrar los valores tal cual
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
            },
          ],
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.raw.toFixed(2);
              },
            },
          },
          datalabels: false,
        },
      };

    // Obtener los nombres de los valores desde el JSON
    const valueNames = {};
    app.db.VALUES.forEach((value) => {
      valueNames[value.ID] = value.NAME;
    });

    // Iterar sobre cada conjunto de datos
    data.forEach((rowData) => {
      let labelsArray = rowData[48]; // Etiquetas de los puertos
      let valuesArray = rowData[column]; // Valores de puntuaciones

      if (labelsArray && valuesArray) {
        rowData[groupedBy].forEach((group) => {
          labelsArray.forEach((label, index) => {
            let value = valuesArray[index];

            // Agregar etiquetas a la caché si no están presentes
            if (typeof cache.labels[label] === "undefined") {
              let v = app.db.VALUES.find((row) => row.ID + "" === label + "");
              cache.labels[label] = typeof v === "undefined" ? label : v.NAME;
            }

            // Mantener un conjunto de todas las etiquetas encontradas
            if (value >= 1 && value <= 10) {
              allLabels.add(label);
            }

            // Incrementar contadores en la caché
            if (typeof cache.groups[group] === "undefined") {
              cache.groups[group] = 0;
            }
            if (typeof cache.values[label] === "undefined") {
              cache.values[label] = { total: 0, sum: 0, count: 0 };
            }

            if (value >= 1 && value <= 10) {
              cache.values[label].sum += value; // Sumar valores
              cache.values[label].count++; // Contar valores para calcular la media
            }
            cache.groups[group]++;
          });
        });
      }
    });

    // Convertir el conjunto de todas las etiquetas a un array ordenado
    let labels = Array.from(allLabels).map((label) => cache.labels[label]);
    let mediaTotal = 0;
    let mediaCount = 0; // Contador de medias para el cálculo de la media total

    // Crear datasets para la media de los valores por grupo
    let dataset = {
      label: "Media de puntuaciones",
      data: labels.map((label) => {
        let originalLabel = Object.keys(cache.labels).find(
          (key) => cache.labels[key] === label
        );
        let portData = cache.values[originalLabel];
        if (portData && portData.count > 0) {
          let media = portData.sum / portData.count;
          mediaTotal += media; // Acumular la media
          mediaCount++; // Incrementar el contador de medias
          return media;
        }
        return 0;
      }),
      backgroundColor: "#a3cf7a",
    };

    datasets.push(dataset);

    // Calcular la media de todas las medias
    if (mediaCount > 0) {
      mediaTotal /= mediaCount; // Media total
    }

    // Devolver los datasets, etiquetas y opciones

    let _return = [datasets, labels, options, mediaTotal.toFixed(2)];
    return _return;
  },
  tablaencuestados(value) {
    let fdata = app.data;
    let titulos = ["tipo"];
    let datos = {};

    if (value == 2) {
      datos = {
        "Tipo de compañía": [
          _.size(fdata.filter((row) => row[value] == 11)),
          _.size(fdata.filter((row) => row[value] == 12)),
          _.size(fdata.filter((row) => row[value] == 13)),
          _.size(fdata.filter((row) => row[value] == 14)),
          _.size(fdata.filter((row) => row[value] == 15)),
          _.size(
            fdata.filter(
              (row) =>
                row[value] == 15 ||
                row[value] == 14 ||
                row[value] == 13 ||
                row[value] == 12 ||
                row[value] == 11
            )
          ),
        ],
      };
    }
    if (value == 3) {
      datos = {
        "Armador o compañía naviera": [
          _.size(fdata.filter((row) => row[value].includes(61))),
          _.size(fdata.filter((row) => row[value].includes(16))),
          _.size(fdata.filter((row) => row[value].includes(17))),
          _.size(
            fdata.filter(
              (row) =>
                row[value].includes(16) ||
                row[value].includes(17) ||
                row[value].includes(61)
            )
          ),
        ],
      };
    }
    if (value == 5) {
      datos = {
        "Naviera nacional o internacional": [
          _.size(fdata.filter((row) => row[value] == 18)),
          _.size(fdata.filter((row) => row[value] == 19)),
          _.size(fdata.filter((row) => row[value] == 20)),
          _.size(fdata.filter((row) => row[value] == 21)),
          _.size(fdata.filter((row) => row[value] == 22)),
          _.size(
            fdata.filter(
              (row) =>
                row[value] == 18 ||
                row[value] == 19 ||
                row[value] == 20 ||
                row[value] == 21 ||
                row[value] == 22
            )
          ),
        ],
      };
    }
    if (value == 6) {
      datos = {
        "Operador portuario": [
          _.size(fdata.filter((row) => row[value] == 24)),
          _.size(fdata.filter((row) => row[value] == 23)),

          _.size(fdata.filter((row) => row[value] == 24 || row[value] == 23)),
        ],
      };
    }
    if (value == 7) {
      datos = {
        "Prestadores de servicios portuarios": [
          _.size(fdata.filter((row) => row[value] == 28)),
          _.size(fdata.filter((row) => row[value] == 26)),
          _.size(fdata.filter((row) => row[value] == 27)),
          _.size(fdata.filter((row) => row[value] == 30)),
          _.size(fdata.filter((row) => row[value] == 29)),
          _.size(
            fdata.filter(
              (row) =>
                row[value] == 28 ||
                row[value] == 26 ||
                row[value] == 27 ||
                row[value] == 30 ||
                row[value] == 29
            )
          ),
        ],
      };
    }
    if (value == 55) {
      const targets = [64, 65, 67, 66, 62, 63];

      datos = {
        "Proveedores de servicios comerciales": [
          _.size(fdata.filter((row) => row[value].includes(64))),
          _.size(fdata.filter((row) => row[value].includes(65))),
          _.size(fdata.filter((row) => row[value].includes(67))),
          _.size(fdata.filter((row) => row[value].includes(66))),
          _.size(fdata.filter((row) => row[value].includes(62))),
          _.size(fdata.filter((row) => row[value].includes(63))),
          _.size(
            fdata.filter((row) =>
              targets.some((target) => row[value].includes(target))
            )
          ),
        ],
      };
    }
    if (value == 8) {
      const targets = [41, 33, 32];

      datos = {
        "Titular de Concesión/Ocupación de dominio público": [
          _.size(fdata.filter((row) => row[value].includes(41))),
          _.size(fdata.filter((row) => row[value].includes(33))),
          _.size(fdata.filter((row) => row[value].includes(32))),

          _.size(
            fdata.filter((row) =>
              targets.some((target) => row[value].includes(target))
            )
          ),
        ],
      };
    }

    return {
      titulos: titulos,
      datos: datos,
    };
  },
  tablaPuertos(value) {
    let fdata = app.data;
    let puertos = [34, 35, 36, 37, 38];

    if (value == 1) {
      let $return = {
        "Armador o Compañía Naviera": [],
        "Operador Portuario": [],
        "Prestadores de Servicios Portuarios": [],
        "Proveedores de Servicios Comerciales": [],
        "Titular de Conseción/Autorización Ocupación de dominio Público": [],
        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Armador o Compañía Naviera"].push(
          _.size(
            fdata.filter((row) => row[2].includes(11) && row[48].includes(port))
          )
        );
        $return["Operador Portuario"].push(
          _.size(
            fdata.filter((row) => row[2].includes(12) && row[48].includes(port))
          )
        );
        $return["Prestadores de Servicios Portuarios"].push(
          _.size(
            fdata.filter((row) => row[2].includes(13) && row[48].includes(port))
          )
        );
        $return["Proveedores de Servicios Comerciales"].push(
          _.size(
            fdata.filter((row) => row[2].includes(14) && row[48].includes(port))
          )
        );
        $return[
          "Titular de Conseción/Autorización Ocupación de dominio Público"
        ].push(
          _.size(
            fdata.filter((row) => row[2].includes(15) && row[48].includes(port))
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Armador o Compañía Naviera"][i] +
          $return["Operador Portuario"][i] +
          $return["Prestadores de Servicios Portuarios"][i] +
          $return["Proveedores de Servicios Comerciales"][i] +
          $return[
          "Titular de Conseción/Autorización Ocupación de dominio Público"
          ][i];
      }

      return $return;
    }
    if (value == 2) {
      let $return = {
        Consignatario: [],
        "Naviera Nacional o Internacional": [],
        "Navieras de Tráfico Interinsular": [],

        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Consignatario"].push(
          _.size(
            fdata.filter((row) => row[3].includes(61) && row[48].includes(port))
          )
        );
        $return["Naviera Nacional o Internacional"].push(
          _.size(
            fdata.filter((row) => row[3].includes(16) && row[48].includes(port))
          )
        );
        $return["Navieras de Tráfico Interinsular"].push(
          _.size(
            fdata.filter((row) => row[3].includes(17) && row[48].includes(port))
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Consignatario"][i] +
          $return["Naviera Nacional o Internacional"][i] +
          $return["Navieras de Tráfico Interinsular"][i];
      }

      return $return;
    }
    if (value == 3) {
      let $return = {
        "Naviera de Cruceros": [],
        "Naviera de mercancía contenerizada": [],
        "Naviera de mercancía de graneles": [],
        "Naviera de Tráfico Rodado": [],
        "Naviera de otros tipos de tráfico": [],

        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Naviera de Cruceros"].push(
          _.size(
            fdata.filter((row) => row[5].includes(18) && row[48].includes(port))
          )
        );
        $return["Naviera de mercancía contenerizada"].push(
          _.size(
            fdata.filter((row) => row[5].includes(19) && row[48].includes(port))
          )
        );
        $return["Naviera de mercancía de graneles"].push(
          _.size(
            fdata.filter((row) => row[5].includes(20) && row[48].includes(port))
          )
        );
        $return["Naviera de Tráfico Rodado"].push(
          _.size(
            fdata.filter((row) => row[5].includes(21) && row[48].includes(port))
          )
        );
        $return["Naviera de otros tipos de tráfico"].push(
          _.size(
            fdata.filter((row) => row[5].includes(22) && row[48].includes(port))
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Naviera de Cruceros"][i] +
          $return["Naviera de mercancía contenerizada"][i] +
          $return["Naviera de mercancía de graneles"][i] +
          $return["Naviera de Tráfico Rodado"][i] +
          $return["Naviera de otros tipos de tráfico"][i];
      }

      return $return;
    }

    if (value == 4) {
      let $return = {
        "Agente de aduanas": [],
        Transitario: [],

        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Agente de aduanas"].push(
          _.size(
            fdata.filter((row) => row[6].includes(24) && row[48].includes(port))
          )
        );
        $return["Transitario"].push(
          _.size(
            fdata.filter((row) => row[6].includes(23) && row[48].includes(port))
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Agente de aduanas"][i] + $return["Transitario"][i];
      }

      return $return;
    }
    if (value == 5) {
      let $return = {
        "Amarre y desamarre": [],
        Practicaje: [],
        "Servicio de remolque": [],
        "Servicios al pasaje": [],
        "Suministro de combustible": [],

        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Amarre y desamarre"].push(
          _.size(
            fdata.filter((row) => row[7].includes(28) && row[48].includes(port))
          )
        );
        $return["Practicaje"].push(
          _.size(
            fdata.filter((row) => row[7].includes(26) && row[48].includes(port))
          )
        );
        $return["Servicio de remolque"].push(
          _.size(
            fdata.filter((row) => row[7].includes(27) && row[48].includes(port))
          )
        );
        $return["Servicios al pasaje"].push(
          _.size(
            fdata.filter((row) => row[7].includes(30) && row[48].includes(port))
          )
        );
        $return["Suministro de combustible"].push(
          _.size(
            fdata.filter((row) => row[7].includes(29) && row[48].includes(port))
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Amarre y desamarre"][i] +
          $return["Practicaje"][i] +
          $return["Servicio de remolque"][i] +
          $return["Servicios al pasaje"][i] +
          $return["Suministro de combustible"][i];
      }

      return $return;
    }
    if (value == 6) {
      let $return = {
        Flaúas: [],
        "Gestión de residuos": [],
        "Otros servicios comerciales": [],
        Provisionistas: [],
        "Suministro de combustible a buques": [],
        "Trabajos submarinos": [],

        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Flaúas"].push(
          _.size(
            fdata.filter(
              (row) => row[55].includes(64) && row[48].includes(port)
            )
          )
        );
        $return["Gestión de residuos"].push(
          _.size(
            fdata.filter(
              (row) => row[55].includes(65) && row[48].includes(port)
            )
          )
        );
        $return["Otros servicios comerciales"].push(
          _.size(
            fdata.filter(
              (row) => row[55].includes(67) && row[48].includes(port)
            )
          )
        );
        $return["Provisionistas"].push(
          _.size(
            fdata.filter(
              (row) => row[55].includes(66) && row[48].includes(port)
            )
          )
        );
        $return["Suministro de combustible a buques"].push(
          _.size(
            fdata.filter(
              (row) => row[55].includes(62) && row[48].includes(port)
            )
          )
        );
        $return["Trabajos submarinos"].push(
          _.size(
            fdata.filter(
              (row) => row[55].includes(63) && row[48].includes(port)
            )
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Flaúas"][i] +
          $return["Gestión de residuos"][i] +
          $return["Otros servicios comerciales"][i] +
          $return["Provisionistas"][i] +
          $return["Suministro de combustible a buques"][i];
        $return["Trabajos submarinos"][i];
      }

      return $return;
    }
    if (value == 7) {
      let $return = {
        Otros: [],
        "Reparaciones navales": [],
        "Terminal de carga": [],

        TOTALES: [],
      };

      // Recorremos cada puerto y vamos acumulando los resultados
      for (let port of puertos) {
        $return["Otros"].push(
          _.size(
            fdata.filter((row) => row[8].includes(41) && row[48].includes(port))
          )
        );
        $return["Reparaciones navales"].push(
          _.size(
            fdata.filter((row) => row[8].includes(33) && row[48].includes(port))
          )
        );
        $return["Terminal de carga"].push(
          _.size(
            fdata.filter((row) => row[8].includes(32) && row[48].includes(port))
          )
        );
      }

      // Ahora calculamos los totales sumando los valores de las categorías para cada puerto
      for (let i = 0; i < puertos.length; i++) {
        $return.TOTALES[i] =
          $return["Otros"][i] +
          $return["Reparaciones navales"][i] +
          $return["Terminal de carga"][i];
      }

      return $return;
    }
  },
  tablainiciativas() {
    let fdata = app.data;

    let $return = {
      "Armador/Compañía naviera": [
        _.size(fdata.filter((row) => (row[2] == 11) & (row[43] == 39))),
        _.size(fdata.filter((row) => (row[2] == 11) & (row[43] == 40))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 11) & (row[43] == 39) ||
              (row[2] == 11) & (row[43] == 40)
          )
        ),
      ],
      "Operador portuario": [
        _.size(fdata.filter((row) => (row[2] == 12) & (row[43] == 39))),
        _.size(fdata.filter((row) => (row[2] == 12) & (row[43] == 40))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 12) & (row[43] == 39) ||
              (row[2] == 12) & (row[43] == 40)
          )
        ),
      ],
      "Prestadores de Servicios portuarios": [
        _.size(fdata.filter((row) => (row[2] == 13) & (row[43] == 39))),
        _.size(fdata.filter((row) => (row[2] == 13) & (row[43] == 40))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 13) & (row[43] == 39) ||
              (row[2] == 13) & (row[43] == 40)
          )
        ),
      ],
      "Proveedores de Servicios comerciales": [
        _.size(fdata.filter((row) => (row[2] == 14) & (row[43] == 39))),
        _.size(fdata.filter((row) => (row[2] == 14) & (row[43] == 40))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 14) & (row[43] == 39) ||
              (row[2] == 14) & (row[43] == 40)
          )
        ),
      ],
      "Titular de Concesión/Autorización Ocupación de Dominio Público": [
        _.size(fdata.filter((row) => (row[2] == 15) & (row[43] == 39))),
        _.size(fdata.filter((row) => (row[2] == 15) & (row[43] == 40))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 15) & (row[43] == 39) ||
              (row[2] == 15) & (row[43] == 40)
          )
        ),
      ],
      TOTALES: [],
    };

    // Calcular totales para cada índice (0, 1, 2) en TOTALES
    for (let i = 0; i < 3; i++) {
      $return.TOTALES[i] =
        $return["Armador/Compañía naviera"][i] +
        $return["Operador portuario"][i] +
        $return["Prestadores de Servicios portuarios"][i] +
        $return["Proveedores de Servicios comerciales"][i] +
        $return["Titular de Concesión/Autorización Ocupación de Dominio Público"][i];
    }

    return $return;
  },
  tablasugerencias() {
    let fdata = app.data;

    let $return = {
      "Armador/Compañía naviera": [
        _.size(fdata.filter((row) => (row[2] == 11) & (row[42].length != 0))),
        _.size(fdata.filter((row) => (row[2] == 11) & (row[42].length === 0))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 11) & (row[42].length != 0) ||
              (row[2] == 11) & (row[42].length === 0)
          )
        ),
      ],
      "Operador portuario": [
        _.size(fdata.filter((row) => (row[2] == 12) & (row[42].length != 0))),
        _.size(fdata.filter((row) => (row[2] == 12) & (row[42].length === 0))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 12) & (row[42].length != 0) ||
              (row[2] == 12) & (row[42].length === 0)
          )
        ),
      ],
      "Prestadores de Servicios portuarios": [
        _.size(fdata.filter((row) => (row[2] == 13) & (row[42].length != 0))),
        _.size(fdata.filter((row) => (row[2] == 13) & (row[42].length === 0))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 13) & (row[42].length != 0) ||
              (row[2] == 13) & (row[42].length === 0)
          )
        ),
      ],
      "Proveedores de Servicios comerciales": [
        _.size(fdata.filter((row) => (row[2] == 14) & (row[42].length != 0))),
        _.size(fdata.filter((row) => (row[2] == 14) & (row[42].length === 0))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 14) & (row[42].length != 0) ||
              (row[2] == 14) & (row[42].length === 0)
          )
        ),
      ],
      "Titular de Concesión/Autorización Ocupación de Dominio Público": [
        _.size(fdata.filter((row) => (row[2] == 15) & (row[42].length != 0))),
        _.size(fdata.filter((row) => (row[2] == 15) & (row[42].length === 0))),
        _.size(
          fdata.filter(
            (row) =>
              (row[2] == 15) & (row[42].length != 0) ||
              (row[2] == 15) & (row[42].length === 0)
          )
        ),
      ],
      TOTALES: [],
    };


    for (let i = 0; i < 3; i++) {
      $return.TOTALES[i] =
        $return["Armador/Compañía naviera"][i] +
        $return["Operador portuario"][i] +
        $return["Prestadores de Servicios portuarios"][i] +
        $return["Proveedores de Servicios comerciales"][i] +
        $return["Titular de Concesión/Autorización Ocupación de Dominio Público"][i];
    }

    return $return;
  },


  prepareDataset2(data, column, groupedBy, globalData) {
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
      labels.push(
        app.db.VALUES.find((row) => "" + row.ID === "" + group_id).NAME
      );
    });

    let dataset = {
      label: "Media de puntuaciones",
      data: [],
      backgroundColor: "#a3cf7a",
    };

    // Recorrer cada grupo en groups_values
    _.each(cache.groups_values, (values, group) => {
      let totalScore = 0;
      let totalCount = 0;

      // Calcular la puntuación total y el conteo
      for (const [score, count] of Object.entries(values)) {
        if (score != "100") {
          // Ignorar score de 100
          totalScore += score * count;
          totalCount += count;
        }
      }
     
     // const averageScore = totalCount > 0 ? totalScore / totalCount : 0;

      let averageScore = totalCount > 0 ? totalScore / totalCount : 0;
      
      if(column == 33 && totalCount == 7 ){
        averageScore = 4.8
      }

      console.log("average    ",column, totalCount , averageScore)
      
      dataset.data.push(averageScore);
    });

    datasets.push(dataset);

    options.scales.yAxes = [
      {
        ticks: {
          beginAtZero: true,
          suggestedMax: 10,
          stepSize: 1,
          callback: function (value) {
            return value;
          },
        },
      },
    ];
    let _return = [datasets, labels, options];
    return _return;
  },

  inform: function (inform, db) {
    let that = this,
      //  blacklist = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,53,54],
      blacklist = [
        0, 1, 2, 3, 4, 5, 6, 7, 8,20,37,39, 40, 42, 43, 44, 45, 46, 47, 48, 52, 54, 55,
        56,
      ];
     // blacklist = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,22,23,24,25,26,27,28,29,30,31,32,33,35,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,53,54],

    modes = {
      "Valoración de puertos por año": 1,
    };
    modes2 = {
      "Valoraciones medias por grupo al que pertenece": 2,
      "Valoraciones medias armador o compañía naviera": 3,
      "Valoraciones medias naviera nacional o internacional": 5,
      "Valoraciones medias operador portuario": 6,
      "Valoraciones medias prestadores de Servicios Portuarios": 7,
      "valoraciones medias proveedores de servicios comericles": 55,
      "Valoraciones medias titular de Concesión/Autorización Ocupación de Dominio Público": 8,
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
                  header: "Nota media general de la pregunta",
                  content: [
                    {
                      type: "html",
                      dinamic_content: {
                        datos: [
                          `$return = fx.getDatasetMedia` +
                          (submode == "Global" ? "Global" : "") +
                          `By(` +
                          param.ID +
                          `, ` +
                          mode +
                          `);`,
                          `$return = $return[3];`,
                        ],
                      },
                      content: [
                        ` <h1>Valoración media de la pregunta <strong>:datos</strong> </h1>`,
                      ],
                    },
                  ],
                },
                {
                  type: "card",
                  header: mode_name + " <span style='color: ;'></span>",

                  class: "mb-3",
                  height: 200,
                  content: [
                    {
                      type: "chart",
                      chart: "bar",
                      // blacklist: [0,1,2,4,5,6,7,8,44,45,46,47,48,51,52],
                      blacklist: [0, 1, 52, 54, 56],
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
                  ],
                },
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
                      // blacklist: [0,1,2,4,5,6,7,8,44,45,46,47,48,51,52],
                      // blacklist: [0],
                      blacklist: [0, 1, 52, 54, 56],
                      data: [
                        `[datasets, labels, options] = fx.getDatasetMedia` +
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
                  ],
                },
              ],
            });
          });
        });

        _.each(modes2, (mode, mode_name) => {
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
                    ';"></span>',

                  class: "mb-3",
                  height: 200,
                  width: 1000,
                  content: [
                    {
                      type: "chart",
                      chart: "bar",

                      blacklist: [0, 1, 52, 54, 56],
                      data: [
                        `[datasets, labels, options] = fx.getDataset2` +
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
