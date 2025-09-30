
let showValues = false;
let loadings = 0;
function updateSearch() {
    let search = $('#searchInput').val().toLowerCase();
    $('.page-switch-btn').each(function () {
        let 
            $this = $(this),
            text = $this.text().toLowerCase();
        text = text.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í').replaceAll('ó', 'o').replaceAll('ú', 'u');
        if (search == '' || text.indexOf(search) >= 0) {
            $this.removeClass('d-none');
        } else {
            $this.addClass('d-none');
        }
    });
}

Chart.plugins.register({
    afterDatasetsDraw: function(chartInstance, easing) {
        // To only draw at the end of animation, check for easing === 1
        var ctx = chartInstance.chart.ctx;

        if (showValues) {

            chartInstance.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.getDatasetMeta(i);
                if (!meta.hidden) {
                    meta.data.forEach(function(element, index) {
                        // Draw the text in black, with the specified font
                        ctx.fillStyle = 'rgb(0, 0, 0)';

                        var fontSize = 9;
                        var fontStyle = 'normal';
                        var fontFamily = 'Helvetica Neue';
                        ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                        // Just naively convert to string for now
                        var dataString = dataset.data[index].toString();

                        var data = parseFloat(dataString);

                        data = Math.round(data * 100) / 100;

                        dataString = '' + data;
                        // Make sure alignment settings are correct
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        

                        var padding = 5;
                        var position = element.tooltipPosition();
                        ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                    });
                }
            });
        }
    }
});


axios.get('./assets/lang/main.json').then(lang => {
    axios.get('./dbmovisalida.json').then(db => {
     //   axios.get('./dbmovi1.json').then(db => {
        axios.get('./colors.json').then(colorPattern => {
            db.data.VALUES = _.map(db.data.VALUES, (value) => {
                let color = colorPattern.data.VALUES.find(row => row.ID == value.ID);
                if (typeof color !== 'undefined') {
                    value.COLOR = color.COLOR;
                }
                return value;
            });

            if (typeof (setupBI) !== 'undefined') {
                db = setupBI(db);
            } 

            axios.get('./inform.json').then(inform => {
                if (typeof fx.inform !== 'undefined') {
                    inform.data = fx.inform(inform.data, db.data);
                }
                Vue.component('bi-content', {
                    data: function () { return {
                        id: _.uniqueId('bi-content_'),
                        chart_id: _.uniqueId('bi-content-chart_'),
                        type: null,
                        el: null,
                        ctx: null,
                        chart: null
                    }},
                    computed: {
                        status: function () {
                            let 
                                that = this,
                                status = false;
                            if (typeof window.app != 'undefined') {
                                if (typeof(that.content.condition) != 'undefined') {
                                    eval(that.content.condition);
                                } else {
                                    status = true;
                                }
                            }
                            return status;
                        },
                        dinamic_content: function () {
                            if (typeof window.app !== 'undefined') {
                                let that = this,
                                    content = that.content.content,
                                    fx = window.fx;
                                if (typeof content.join !== undefined) { content = content.join('\n'); }
                                if (typeof that.content.dinamic_content !== 'undefined') {
                                    _.each(that.content.dinamic_content, (value, param) => {
                                        content = content.split(`:${param}`);
                                        if (typeof content.join !== 'undefined') {
                                            if (typeof value.join !== 'undefined') {
                                                value = value.join('\n');
                                            }
                                            content = content.join(eval(value));
                                        }
                                    });
                                }
                                return content;
                            } else {
                                return '';
                            }
                        },
                        table_content: function () {
                            if (window.app) {
                                let
                                    that = window.app,
                                    data = that.data,
                                    db = that.db,
                                    table = this,
                                    fx = window.fx,
                                    $return = {},
                                    formula = table.content.data;
                                fx.chart = table;
                                if (typeof (formula) !== 'string') {
                                    formula = formula.join("\n");
                                }
                                eval(formula);
                                return $return;
                            } else {
                                return {};
                            }
                        }
                    },
                    methods: {  
                        dlCanvas: function () {
                            if (!this.chart_id) {
                                console.error("chart_id no está definido");
                                return;
                            }
                        
                            let baseId = this.chart_id.replace("bi-content-chart_", ""); 
                            let newId = "bi-content-chart_" + (parseInt(baseId, 10) + 4); 
                            let canvas = document.getElementById(newId);
                        
                            if (!canvas) {
                                console.error("Canvas no encontrado:", newId);
                                return;
                            }
                        
                            let scaleFactor = 2; // Aumenta la resolución 2x
                            let originalCanvas = canvas; // Guardamos el canvas original
                        
                            // Crear un nuevo canvas temporal con mejor resolución
                            let tempCanvas = document.createElement("canvas");
                            tempCanvas.width = originalCanvas.width * scaleFactor;
                            tempCanvas.height = originalCanvas.height * scaleFactor;
                            let ctx = tempCanvas.getContext("2d");
                        
                            // Dibujar la imagen original con mejor resolución
                            ctx.drawImage(originalCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
                        
                            // Convertir a imagen y descargar
                            tempCanvas.toBlob(function (blob) {
                                var link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = "canvas_image_high_res.jpg";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }, "image/jpeg", 1.0);
                        },
                        dlCanvas2: function () {
                            if (!this.chart_id) {
                                console.error("chart_id no está definido");
                                return;
                            }
                        
                            let baseId = this.chart_id.replace("bi-content-chart_", ""); 
                            let newId = "bi-content-chart_" + (parseInt(baseId, 10) + 4); 
                            let canvas = document.getElementById(newId);
                        
                            if (!canvas) {
                                console.error("Canvas no encontrado:", newId);
                                return;
                            }
                        
                            let scaleFactor = 2; // Aumenta la resolución 2x
                            let originalCanvas = canvas;
                        
                            // Crear un nuevo canvas temporal con mejor resolución
                            let tempCanvas = document.createElement("canvas");
                            tempCanvas.width = originalCanvas.width * scaleFactor;
                            tempCanvas.height = originalCanvas.height * scaleFactor;
                            let ctx = tempCanvas.getContext("2d");
                        
                            // Dibujar la imagen original con mejor resolución
                            ctx.drawImage(originalCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
                        
                            // Convertir a Blob y copiar al portapapeles
                            tempCanvas.toBlob(function (blob) {
                                let item = new ClipboardItem({ "image/png": blob });
                                navigator.clipboard.write([item]).then(function () {
                                    console.log("Imagen copiada al portapapeles.");
                                }).catch(function (err) {
                                    console.error("Error al copiar la imagen:", err);
                                });
                            }, "image/png");
                        },
                        

                        
      
                    
                    
                     
                        exportTableToExcel: function () {
                            var downloadLink;
                            var dataType = 'application/vnd.ms-excel';
                            var tableSelect = this.$el.querySelector('table');
                            var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
                            
                            // Specify file name
                            filename = 'table.xls';
                            
                            // Create download link element
                            downloadLink = document.createElement("a");
                            
                            document.body.appendChild(downloadLink);
                            
                            if(navigator.msSaveOrOpenBlob){
                                var blob = new Blob(['\ufeff', tableHTML], {
                                    type: dataType
                                });
                                navigator.msSaveOrOpenBlob( blob, filename);
                            }else{
                                // Create a link to the file
                                downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
                            
                                // Setting the file name
                                downloadLink.download = filename;
                                
                                //triggering the function
                                downloadLink.click();
                            }
                        }
                    },
                    props: ['content'],
                    mounted: function () {
                        let that = this;
                        if (that.status) {
                            if (['chart', 'card-chart'].indexOf(that.content.type) >= 0) {
                                that.type = that.content.chart;
                                if (!that.chart) {
                                    that.el = document.getElementById(that.chart_id);
                                    that.ctx = that.el.getContext('2d');
                                    that.chart = new Chart(that.ctx, {
                                        type: that.content.chart,
                                        options: {           
                                            layout: {
                                                padding: {
                                                    left: 50,
                                                    right: 50,
                                                    top: 50,
                                                    bottom: 50
                                                }
                                            },
                                            tooltips: {},
                                            plugins: {
                                                colorschemes: {
                                                    scheme: that.$root.color_schema
                                                }
                                            },
                                        }
                                    });
                                }
                                loadings++;
                                $('#Loader').removeClass('d-none');
                                that.$root.updateChart(that);
                            }
                        }
                    },
                    template: `
                        <div v-bind:class="[content.type, content.class]" v-bind:id='id' v-if="status">
                            <bi-content v-if="['row', 'col'].indexOf(content.type) >= 0" v-for="subcontent in content.content" v-bind:content="subcontent" v-bind:key="_.uniqueId('bi-content_')"></bi-content>
                            <canvas v-if="['chart'].indexOf(content.type) >= 0" v-bind:id='chart_id' v-bind:style="[content.style]" v-bind:height="[content.height]" v-bind:width="[content.width]"></canvas>
                            <div v-if="['card', 'card-chart'].indexOf(content.type) >= 0" class="card">
                                <div class="card-header" v-if='typeof content.header !== "undefined"'>
                                    <div class="card-header-title" v-html="content.header"></div>
                                    <button class='btn btn-primary float-right' v-if="content.table_download" v-on:click="exportTableToExcel"><i class="bi bi-download"></i></button>
                                </div>
                                <div class="card-body"> 
                                    <canvas v-if="['card-chart'].indexOf(content.type) >= 0" v-bind:id='chart_id'></canvas>
                                    
                                     <button class="btn btn-primary"  v-on:click="dlCanvas()">Descargar Gráfico</button>
                                     <button class="btn btn-primary"  v-on:click="dlCanvas2()">Copiar</button>
                                   
                                    <bi-content v-if="['card-chart'].indexOf(content.type) < 0" v-for="subcontent in content.content" v-bind:content="subcontent" v-bind:key="_.uniqueId('bi-content_')"></bi-content>
                                </div>
                            </div>
                            <div v-if="['html'].indexOf(content.type) >= 0" v-html="dinamic_content"></div>
                            <table v-if="['table'].indexOf(content.type) >= 0">
                                <thead>
                                    <th v-for="(title, title_index) in content.titles" :class="[title_index > 0 || content.hide_row_name == true ? 'text-center' : '']">{{title}}</th>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, row_name) in table_content">
                                        <th v-if="typeof content.hide_row_name === 'undefined' || content.hide_row_name == false" v-html="row_name"></th>
                                        <td v-for="col in row" class="text-center" v-html="col"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                });







                window.app = new Vue({
                    el: '#App',
                    data: {
                        current_page: 0,
                        current_lang: 'es-ES',
                        color_schema: 'tableau.Tableau20',
                        lang: lang.data,
                        db: db.data,
                        fdb: null,
                        inform: inform.data,
                        filters: [],
                        search: '',
                        show_values: showValues
                    },
                    watch: {
                        current_page: function () {
                            $('#Loader').removeClass('d-none');
                        }
                    },
                    computed: {
                        pagesSearch: function () {
                            let pages = {}, that = this;
                            _.each(this.inform.pages, (page, i) => {
                                if (page.name.toLowerCase().indexOf(that.search) >= 0) {
                                    pages[i] = page;
                                }
                            });
                            return pages;
                        },
                        data: function () { return this.fdb ? this.fdb : this.db['DATA']; },
                        page: function () { return this.inform.pages[this.current_page]; },
                        pageFilters: function () {
                            let
                                that = this,
                                filters_ids = _.union(that.inform.inform_filters ? that.inform.inform_filters : [], that.page.filters ? that.page.filters : [] ),
                                filters = {};
                            _.each(filters_ids, id => {
                                filters[id] = that.getFilter(id);
                            });
                            return filters;
                        },
                        i18n: function () { return this.lang[this.current_lang]; }
                    },
                    methods: {
                        __: function (id, data) {
                            let 
                                that = this,
                                text = typeof(that.i18n[id]) !== 'undefined' ? that.i18n[id] : id;
                            if (typeof(data) !== 'object') { data = {}; }
                            _.each(data, (param, value) => {
                                text = text.split(`{{${param}}}`).join(value);
                            });
                            return text;
                        }, 
                        salir: function(){
                            console.log("salir")
                         window.location.href = '../index.html';
                        },
                        btnHideValues: function () {
                            let
                                that = this,
                                cp = that.current_page;
                            that.show_values = false;
                            showValues = false;
                            that.changePage(-1);
                            that.changePage(cp);
                        },
                        btnShowValues: function () {
                            let
                                that = this,
                                cp = that.current_page;
                            that.show_values = true;
                            showValues = true;
                            that.changePage(-1);
                            that.changePage(cp);
                        },
                        changePage: function (page) { this.current_page = page; },
                        getUniquesValues: function (data, column) {
                            let values = [];
                            _.each(data, function (row) {
                                if (_.size(row[column]) < 1 && values.indexOf('aibi:filter:null') < 0) {
                                    values.push('aibi:filter:null');
                                } else {
                                    _.each(row[column], function (value) {
                                        if (values.indexOf(value) < 0) {
                                            values.push(value);
                                        }
                                    });
                                }
                            });
                            return values;
                        },
                        getParamName: function (id) { return this.db['PARAMS'].find(param => param.ID === id).NAME; },
                        getValueName: function (id) {
                            let
                                that = this,
                                values = that.db['VALUES'].filter(value => value.ID === id);
                            if (id === 'aibi:filter:null') {
                                return '(' + that.__('Empty') + ')';
                            }
                            if (_.size(values) > 0) {
                                return values[0].NAME;
                            }
                            return that.__('Does not apply');
                        },
                        getFilter: function(id) { return this.inform.filters[id]; },
                        getFilterOptions: function(id) {
                            let
                                that = this,
                                data = that.data,
                                db = that.db,
                                columnFilter = function (column) { return _.sortBy(_.map(that.getUniquesValues(db['DATA'], column), value => { return { ID: value, NAME: that.getValueName(value) }; }), 'NAME'); },
                                pageFilter = that.getFilter(id),
                                formula = pageFilter.options,
                                options = [];
                            if (typeof formula !== 'undefined' && typeof (formula) !== 'string') {
                                formula = formula.join("\n");
                            }
                            if (typeof pageFilter.column !== 'undefined') {
                                options = columnFilter(pageFilter.column);
                            } else {
                                eval(formula);
                            }
                            let valid_options = [];
                            _.each(options, option => {
                                let filter = that.filters.find(filter => filter.FILTER === id && filter.OPTION === option.ID);
                                if (!filter) {
                                    let valid = true;
                                    if (typeof pageFilter.blacklist !== 'undefined' && pageFilter.blacklist.indexOf(option.ID) >= 0) {
                                        valid = false;
                                    }
                                    if (valid) {
                                        filter = { FILTER: id, OPTION: option.ID, STATUS: false };
                                        that.filters.push(filter);
                                        valid_options.push(option);
                                    }
                                } else {
                                    let valid = true;
                                    if (typeof pageFilter.blacklist !== 'undefined' && pageFilter.blacklist.indexOf(filter.OPTION) >= 0) {
                                        valid = false;
                                    }
                                    if (valid) {
                                        valid_options.push(option);
                                    }
                                }
                            });
                            return valid_options;
                        },
                        _getFilter(filter_id, option_id) {
                            let
                                that = this,
                                filter = that.filters.find(filter => filter.FILTER === filter_id && filter.OPTION === option_id);
                            if (!filter) {
                                filter = { FILTER: filter_id, OPTION: option_id, STATUS: false };
                                that.filters.push(filter);
                            }
                            return filter;
                        },
                        getFilterStatus(filter_id, option_id) {
                            return this._getFilter(filter_id, option_id).STATUS;
                        },
                        getFilterStatusAll(filter_id) {
                            let
                                that = this,
                                $return = true;
                            _.each(that.filters.filter(filter => filter.FILTER === filter_id), (option) => {
                                if (!that.getFilterStatus(filter_id, option.OPTION)) {
                                    $return = false;
                                }
                            });
                            return $return;
                        },
                        toggleFilterStatus(filter_id, option_id) {
                            let 
                                that = this,
                                filter = that._getFilter(filter_id, option_id),
                                pageFilters = [],
                                db = that.db,
                                data = db['DATA'],
                                columnFilter = function (column, data, options) {
                                    return data.filter(row => _.size(_.intersection(row[column], options)) > 0 || (options.indexOf('aibi:filter:null') >= 0 && _.size(row[column]) < 1));
                                };
                            filter.STATUS = !filter.STATUS;
                            pageFilters = that.pageFilters;
                            _.each(pageFilters, (pageFilter, pageFilterId) => {
                                let pageFilterOptions = that.filters.filter(filter => filter.FILTER === pageFilterId && filter.STATUS === true);
                                if (_.size(pageFilterOptions) > 0) {
                                    let formula = pageFilter.formula,
                                        options = [],
                                        filtrered = [];
                                    if (typeof formula !== 'undefined' && typeof (formula) !== 'string') {
                                        formula = formula.join("\n");
                                    }
                                    _.each(pageFilterOptions, option => {
                                        options.push(option.OPTION);
                                    });
                                    if (typeof pageFilter.column !== 'undefined') {
                                        data = columnFilter(pageFilter.column , data, options);
                                    } else {
                                        eval(formula);
                                    }
                                }
                            });
                            that.fdb = data;
                        },
                        toggleFilterStatusAll: function (filter_id) {

                            let
                                that = this,
                                status = !that.getFilterStatusAll(filter_id);
                            _.each(that.filters.filter(filter => filter.FILTER === filter_id), (option) => {
                                option.STATUS = status;
                            });
                        },
                        updateChart: function (bichart) {
                            if (typeof window.app !== 'undefined') {
                                let
                                    that = this,
                                    data = that.data,
                                    db = that.db,
                                    chart = bichart.chart,
                                    fx = window.fx,
                                    getSimpleDataset = function (column) {
                                        let dataset = {},
                                            result = {
                                                datasets: [],
                                                labels: []
                                            };
                                        _.each(data, row => {
                                            _.each(row[column], value => {
                                                if (typeof dataset[value] === 'undefined') {
                                                    dataset[value] = { NAME: db['VALUES'].find(row => row.ID === value).NAME, VALUE: 0 };
                                                }
                                                dataset[value].VALUE++;
                                            });
                                        });
                                        let i = 0;
                                        _.each(_.sortBy(dataset, 'NAME'), value => {
                                            if (typeof(result.datasets[i]) === 'undefined') {
                                              //  console.log("result.datasets[i]   ",result.datasets[i])
                                                result.datasets[i] = { data: [] };
                                            }
                                            result.datasets[i].data.push(value.VALUE);
                                            if (['pie'].indexOf(bichart.type) < 0) {
                                                result.datasets[i].label = value.NAME;
                                                i++;
                                            } else {
                                                result.labels.push(value.NAME);
                                            }
                                        });
                                        return [result.datasets, result.labels];
                                    },
                                    formula = bichart.content.data,
                                    datasets = {},
                                    labels = [];
                                fx.chart = bichart;
                                if (typeof (formula) !== 'string') {
                                    formula = formula.join("\n");
                                }
                                eval(formula);
                                chart.data.datasets = datasets;
                                chart.data.labels = labels;
                                if (typeof options !== 'undefined') {
                                    chart.options = _.defaultsDeep(options, chart.options); 
                                }
                                chart.update();
                                loadings--;
                                if (loadings <= 0) {
                                    loadings = 0;
                                    $('#Loader').addClass('d-none')
                                }
                            }
                        }
                    },
                    mounted: function () {
                        $('#Loader').addClass('d-none');
                    },
                    updated: function () {
                        this.$nextTick(function () {
                            updateSearch();
                            
                            $('#searchInput').off();
                            $('#searchInput').on('keyup', function () {
                                updateSearch();
                            });
                            if (loadings <= 0) {
                                $('#Loader').addClass('d-none');
                            }
                        });
                    }
                });
            });
        });
    });


});