if (typeof DCI == "undefined") { var DCI = {}; }
DCI.Plot = {
	 /**
	  * 地图标注功能模块的Html部分
	 */
      Html:"<!-- tab导航部分 -->" +
        "<div class='allleft_top' id='toppoi'>" +
        "<div class='triangle_div' id='triangle_poi'></div>" +
          "<ul style='margin-left:0px;'>"+
            "<li id='shapesymbol'><span><span class='flss'></span><a href='javascript:void(0)'>形状选择</a></span></li>" +
            "<li id='textsymbol'><span><span class='flss'></span><a href='javascript:void(0);'>文本输入</a></span></li>"+
            "<li id='picturesymbol'><span><span class='flss'></span><a href='javascript:void(0);'>图片标注</a></span></li>" +
          "</ul>" +
        "</div>"+
        "<div id='shapepage' style='height:100%;margin-top:10px;margin-bottom:5px;float:left;'>" +
             "<span class='plot_freehandline'></span>" +
             "<span class='plot_line'></span>" +
             "<span class='emergency_freehand'></span>" +
             "<span class='emergency_polygon'></span>" +
             "<span class='emergency_rect'></span>" +
             "<span class='emergency_circle'></span>" +
             "<span class='emergency_straight_arrow'></span>" +
             "<span class='emergency_simple_arrow'></span>" +
             "<span class='emergency_tailed_arrow'></span>" +
             "<span class='emergency_assembly'></span>" +
             "<span class='emergency_hx'></span>" +
             "<span class='emergency_qx'></span>" +  
        "</div>"+
        "<div id='textpage' style='height:100%;display:none;margin-top:10px;margin-bottom:5px;float:left;'>" +
             "<textarea style='width:350px;height:70px;' id='inputtextsymbol'>"+
                "输入文本标记"+
             "</textarea>"+
             "<div id='buttontextsymbol' style='float:right;background-color:#94D5FD;margin-top:1px;cursor:pointer;width:60px;'>添加注记</div>"+
        "</div>"+
        "<div id='picturepage' style='height:100%;display:none;margin-top:10px;margin-bottom:5px;float:left;'>" +
            "<div>" +
            "<label style='font-size:13px;float:left;height:22px;'>请选择图片类型:</label>" +
            "<select id='picType' style='font-size:13px;float:left;height:22px;'>" +
                         "<option value ='0'>车辆类</option>" +
                         "<option value ='1'>消防力量</option>" +
                         "<option value ='2'>物质资源</option>" +
            "</select>" +
            "</div>" +
            "<div style='clear:both;margin-left:30px;' id='picSrc'>" +
            "</div>" +
        "</div>",
        pichtml_car: "<img src='Content/images/plot/car/c6.gif' class='img_plot' />" +
        "<img src='Content/images/plot/car/c6-1.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/car/c6-2.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/car/c0.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/car/c5.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/car/c1.gif' class='img_plot'/>",
       pichtml_person: "<img src='Content/images/plot/person/p0.gif' class='img_plot'/>"+
        "<img src='Content/images/plot/person/p0-1.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/person/p0-2.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/person/p1-1.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/person/p1-2.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/person/p1.gif' class='img_plot'/>",
       pichtml_material: "<img src='Content/images/plot/material/m5.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/material/m5-2.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/material/m3.gif' class='img_plot'/>" +
        "<img src='Content/images/plot/material/m3-1.gif' class='img_plot'/>"+        
        "<img src='Content/images/plot/material/m3-2.gif' class='img_plot'/>"+ 
        "<img src='Content/images/plot/material/m0.gif' class='img_plot'/>",
        
        dialog:null,//对话框
        map:null,
        graphicslayer:null,
        isload:null,
        imgPath:null,
        toolbar:null,//拓展draw
        toolbar1: null,//拓展draw
        drawToolbar: null,//draw工具
        markerSymbol: null,//默认点符号
        lineSymbol: null,//默认线符号
        fillSymbol: null,//默认面符号
        onDrawEnd: null,//draw回调函数
        //模块初始化函数
        Init:function(map){
            DCI.Plot.map = map;
            DCI.Plot.graphicslayer = new esri.layers.GraphicsLayer();
            DCI.Plot.graphicslayer.id = "plot";
            DCI.Plot.map.addLayer(DCI.Plot.graphicslayer);  //将图层赋给地图
            dojo.connect(DCI.Plot.graphicslayer, "onClick", function (event) {
                if (event.graphic.attributes)
                    DCI.Plot.showGraphicWin(event.graphic);
            });
            DCI.Plot.isload = true;
            //定义默认点 线  面符号
            DCI.Plot.markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 69, 0]), 2), new dojo.Color([255, 255, 255, 1]));
            DCI.Plot.lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2);
            DCI.Plot.fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2), new dojo.Color([255, 255, 255, 0.5]));
            //初始化拓展Draw
            DCI.Plot.toolbar = new Extension.DrawEx(map);
            DCI.Plot.toolbar.on("draw-end", DCI.Plot.addToMap);
            DCI.Plot.toolbar1 = new ExtensionDraw.DrawExt(map);
            DCI.Plot.toolbar1.on("draw-end", DCI.Plot.addToMap);
            //arcgis api自带的Draw
            DCI.Plot.drawToolbar = new esri.toolbars.Draw(map);
            DCI.Plot.drawToolbar.markerSymbol = DCI.Plot.markerSymbol;
            DCI.Plot.drawToolbar.lineSymbol = DCI.Plot.lineSymbol;
            DCI.Plot.drawToolbar.fillSymbol = DCI.Plot.fillSymbol;
            DCI.Plot.drawToolbar.on("draw-end", DCI.Plot.drawEnd);

        },
        /**
         * 点击绘制图形
         * 弹出气泡窗口显示详情
        */        
        showGraphicWin:function(graphic){
        	var pt;
            if (graphic) {
                switch (graphic.geometry.type) {
                    case "point"://点
                        pt = graphic.geometry;
                        break;
                    case "polyline"://线
                        pt = graphic.geometry.getPoint(0, 0);
                        break;
                    case "polygon"://面
                        pt = graphic.geometry.getExtent().getCenter();
                        break;
                    default:
                        pt = graphic.geometry.getExtent().getCenter();
                        break;
                }               
                var htmlstr = graphic.attributes.content;
                DCI.Plot.map.centerAt(pt);
                DCI.Plot.map.infoWindow.resize(300, 210);
                DCI.Plot.map.infoWindow.setTitle(graphic.attributes.title);
                DCI.Plot.map.infoWindow.setContent(htmlstr);
                setTimeout(function () {
                    DCI.Plot.map.infoWindow.show(pt);
                }, 500);
            }        	
        },
        drawEnd: function (evt) {
            if (DCI.Plot.onDrawEnd)
                DCI.Plot.onDrawEnd(evt.geometry);
        },
        /**
         * 拓展Draw绘制完毕调用的函数
        */
        addToMap: function (evt) {
            DCI.Plot.map.setMapCursor('auto');//设置鼠标的光标      
            var symbol;
            DCI.Plot.toolbar.deactivate();
            DCI.Plot.toolbar1.deactivate();
            switch (evt.geometry.type)
            {
                case "point":
                case "multipoint":
                    symbol = DCI.Plot.markerSymbol;
                    break;
                case "polyline":
                    symbol = DCI.Plot.lineSymbol;
                	break;
                default:
                    symbol = DCI.Plot.fillSymbol;
                	break;
            }
            var title = "标题";
            var htmlCon = "测试内容测试内容";
            var attr = { "title": title, "content": htmlCon};
            var graphic = new esri.Graphic(evt.geometry, symbol, attr);
            DCI.Plot.graphicslayer.add(graphic);
        },
        //初始化监听事件
        InitEvent:function(){
            //搜索模块的顶端部分的切换事件
            $("#toppoi li").bind("click", function () {
                var keyword = $(this).attr("id");
                //图片默认加载第一类别
                if($("#picSrc").html().length<=0){
                    $("#picSrc").append(DCI.Plot.pichtml_car);
                }
                //标绘---图片标注选择具体某个图标事件
                $("#picSrc img").bind("click", function () {
                    DCI.Plot.imgPath = this.src;
                    DCI.Plot.map.setMapCursor('crosshair');
                    var symbol = new esri.symbol.PictureMarkerSymbol(DCI.Plot.imgPath, 32, 32);
                    DCI.Plot.drawPoint(symbol, function (geometry) {
                        DCI.Plot.drawEndPlot(geometry, symbol);
                    });
                });
                //三角形标识切换
                switch ($(this).index()) {
                    case 0://形状选择
                        $(".triangle_div").css("left", "48px");
                        break;
                    case 1://文本输入
                        $(".triangle_div").css("left", "125px");
                        break;
                    case 2://图片标注
                        $(".triangle_div").css("left", "210px");
                        break;
                }
                DCI.Plot.onSelectTab(keyword);
            });
            //标绘---点击事件
            $('#buttontextsymbol').click(function () {
                DCI.Plot.map.setMapCursor('crosshair');
                var symbol = new esri.symbol.TextSymbol($('#inputtextsymbol').val()).setColor(new dojo.Color([128, 0, 0])).setFont(
                	    new esri.symbol.Font("12pt").setWeight(esri.symbol.Font.WEIGHT_BOLD));
                DCI.Plot.drawPoint(symbol, function (geometry) {
                    DCI.Plot.drawEndPlot(geometry, symbol);
                });
            });
            //标绘---形状选择点击事件
            $("#shapepage span").bind("click", function () {
                if (DCI.Plot.map) {
                    DCI.Plot.map.setMapCursor('auto');//设置鼠标的光标
                }
                DCI.Plot.map.setMapCursor('crosshair');
                var symbol=null;
                var geo = null;
                switch ($(this).index()) {
                    case 0://plot_freehandline
                        DCI.Plot.drawFreeHandPolyline(null, function (geometry) {
                            symbol = DCI.Plot.lineSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 1://plot_line
                        DCI.Plot.drawPolyline(null, function (geometry) {
                            symbol = DCI.Plot.lineSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 2://emergency_freehand
                        DCI.Plot.drawFreeHandPolygon(null, function (geometry) {
                            symbol = DCI.Plot.fillSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 3://plot_polygon
                        DCI.Plot.drawPolygon(null, function (geometry) {
                            symbol = DCI.Plot.fillSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 4://plot_extent
                        DCI.Plot.drawExtent(null, function (geometry) {
                            symbol = DCI.Plot.fillSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 5://emergency_freehand
                        DCI.Plot.drawCircle(null, function (geometry) {
                            symbol = DCI.Plot.fillSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 6://直角箭头
                        DCI.Plot.drawStraightArrow(null, function (geometry) {
                            symbol = DCI.Plot.fillSymbol;
                            DCI.Plot.drawEndPlot(geometry, symbol);
                        });
                        break;
                    case 7://简单箭头
                        DCI.Plot.toolbar.activate(Extension.DrawEx.FREEHAND_ARROW);
                      break; 
                    case 8://燕尾箭头
                        DCI.Plot.toolbar1.fillSymbol = DCI.Plot.fillSymbol;
                        DCI.Plot.toolbar1.activate("tailedsquadcombat");
                        break;  
                    case 9://集结地
                        DCI.Plot.toolbar.activate(Extension.DrawEx.BEZIER_POLYGON);
                      break; 
                    case 10://弧线
                        DCI.Plot.toolbar.activate(Extension.DrawEx.CURVE);
                      break;  
                    case 11://曲线
                        DCI.Plot.toolbar.activate(Extension.DrawEx.BEZIER_CURVE);
                      break;                        
                        
                }
                                  
            });
            //标绘---图片标注 选择监听事件
            $('#picType').change(function () {
                var index = $(this).children('option:selected').val();
                switch (index) {
                    case "0"://车辆类
                        $("#picSrc").empty();
                        $("#picSrc").append(DCI.Plot.pichtml_car);
                        break;
                    case "1"://人员类
                        $("#picSrc").empty();
                        $("#picSrc").append(DCI.Plot.pichtml_person);
                        break;
                    case "2"://物资类
                        $("#picSrc").empty();
                        $("#picSrc").append(DCI.Plot.pichtml_material);
                        break;
                }
                //标绘---图片标注选择具体某个图标事件
                $("#picSrc img").bind("click", function () {               	
                    DCI.Plot.imgPath = this.src;
                    DCI.Plot.map.setMapCursor('crosshair');
                    var symbol = new esri.symbol.PictureMarkerSymbol(DCI.Plot.imgPath, 32, 32);
                    DCI.Plot.drawPoint(symbol, function (geometry) {
                        DCI.Plot.drawEndPlot(geometry, symbol);
                    });
                });
            });

            if (DCI.Plot.dialog) {
                DCI.Plot.dialog.bind("close", function () {
                    DCI.Plot.graphicslayer.clear();
                    DCI.Plot.map.infoWindow.hide();
            	}); 
            }
            
            
        },
        
        onSelectTab: function (keyword) {
            DCI.Plot.deactivateDraw();
            DCI.Plot.map.setMapCursor('auto');//设置鼠标的光标   
            if (keyword == "shapesymbol" || keyword == null) {
                $("#shapepage").css({ display: "block" });
                $("#textpage").css({ display: "none" });
                $("#picturepage").css({ display: "none" });
            }
            else if (keyword == "textsymbol") {
                $("#shapepage").css({ display: "none" });
                $("#textpage").css({ display: "block" });
                $("#picturepage").css({ display: "none" });
            }
            else if (keyword == "picturesymbol") {
                $("#shapepage").css({ display: "none" });
                $("#textpage").css({ display: "none" });
                $("#picturepage").css({ display: "block" });
            }
        },       
        /**
         * 绘制完毕调用的函数
        */
        drawEndPlot: function (geometry,symbol) {
            var title = "标题";
            var htmlCon = "测试内容测试内容";
            var attr = { "title": title, "content": htmlCon};
            var graphic = new esri.Graphic(geometry, symbol, attr);
            DCI.Plot.graphicslayer.add(graphic);
            DCI.Plot.deactivateDraw();
            DCI.Plot.map.setMapCursor('auto');//设置鼠标的光标          
        },
        //画点
        drawPoint: function (symbol, onDrawEnd) {
            DCI.Plot.onDrawEnd = onDrawEnd;
            if (symbol) {
                DCI.Plot.drawToolbar.markerSymbol = symbol;
            }
            DCI.Plot.drawToolbar.activate(esri.toolbars.Draw.POINT);
            DCI.Plot.disablePan();
        },
        //画折线
        drawPolyline: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.lineSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
            this.disablePan();
        },
        //自由线
        drawFreeHandPolyline: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.lineSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.FREEHAND_POLYLINE);
            this.disablePan();
        },
        //画多边形
        drawPolygon: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.fillSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.POLYGON);
            this.disablePan();
        },
        //手绘多边形
        drawFreeHandPolygon: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.fillSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
            this.disablePan();
        },
        //画圆形
        drawCircle: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.fillSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.CIRCLE);
            this.disablePan();
        },
        //画矩形
        drawExtent: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.fillSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.EXTENT);
            this.disablePan();
        },
        //直角箭头
        drawStraightArrow: function (symbol, onDrawEnd) {
            this.onDrawEnd = onDrawEnd;
            if (symbol) {
                this.drawToolbar.fillSymbol = symbol;
            }
            this.drawToolbar.activate(esri.toolbars.Draw.ARROW);
            this.disablePan();
        },
        deactivateDraw: function () {
            this.drawToolbar.deactivate();
            this.onDrawEnd = null;
            this.enablePan();
        },
        disablePan: function () {
            this.map.disablePan();
        },
        enablePan: function () {
            this.map.enablePan();
        }


}