$(document).ready(function() {
    //全局变量，判断josephus是否初始化
    is_initJosephus = false;

    //"重置"按钮执行的操作
    $('#reset').click(function() {
        clearInterval(timer);
        initJosephus();
        showRunProcess(josephus);
    })
    //"运行"按钮执行的操作
    $('#start-run').click(function() {
        if (!is_initJosephus) {
            initJosephus()
        }
        showRunProcess(josephus)

    })
    //"暂停"按钮执行的操作
    $('#pause').click(function() {
        clearInterval(timer);
        console.log(josephus);
    })

    //"保存当前进度"按钮执行的操作
    $('#save').click(function() {
        $('#pause').trigger('click');
        var temp = josephus;
        temp.head = josephus.head.element;
        var content = JSON.stringify(temp);
        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "josephus.json");
    })
    //"从文件导入进度"按钮执行的操作
    $('#load-state').click(function() {
        $('#files').trigger('click');
    })
    //用于到处文件的操作
    $('#files').change(function() {
        importFile();
    })

    //在界面显示初始化的节点
    function initItems(nodes) {
        $('#nodes').html('')
        for (var i = 0; i < nodes.length; i++) {
            $('#nodes').append('<span class="item" id="' + nodes[i] + '">' + nodes[i] + '</span>')
        }

        var width = 32*(nodes.length)/2.5
        $('#nodes').css({'width': width,'height':width})
        var radius = $('#nodes').width()/2
        formatCircle($('#nodes'),$('.item'),radius)
    }

    //根据参数初始化一个josephus实例
    function initJosephus() {
        var n = parseInt($('#n').val()); //n 总人数
        var k = parseInt($('#k').val()); //从编号为k的开始报数
        var m = parseInt($('#m').val()); //数到3的出列
        var speed = parseInt($('#speed').val()); //动画速度，单位是ms

        if(!n | n<=0){
            return alert('总人数n必须大于等于1')
        }
        if(!k | k<=0){
            return alert('起始编号k必须大于等于1')
        }
        if(!m | m<=0){
            return alert('出列数字必须大于等于1')
        }
        if(!speed | speed<0){
            return alert('速度值必须大于等于0')
        }
        if(n<k){
            return alert('起始编号k必须小于总人数n')
        }

        var nodes = initElements(n);
        var cirLinkList = circleList(nodes, k);

        //josephus定义为全局变量便于存储
        josephus = new Josephus(cirLinkList, m, n, k, speed);
        is_initJosephus = true;
    }

    //初始化结果显示界面
    function initResult(josephus) {
        var kill_arr = josephus.kill_arr;
        var all_arr = initElements(josephus.n);
        initItems(all_arr);
        $('#n').val(josephus.n);
        $('#m').val(josephus.m);
        $('#k').val(josephus.k);
        $('#speed').val(josephus.speed);
        $('#result').html('');
        for (var i = 0; i < kill_arr.length; i++) {
            $('#' + kill_arr[i]).css('background-color', '#999');
            $('#result').append('<span class="number">' + kill_arr[i] + '</span>')
        }
    }

    function initCircleList(ele_arr, k) {
        return circleList(ele_arr, k);
    }

    //运行并显示运行状态
    function showRunProcess(josephus) {
        initResult(josephus);
        if (josephus.head != null) {
            //timer定义为全局变量，使得可以stop
            timer = setInterval(function() {
                josephus = getOneKilled(josephus);
                $('#' + josephus.kill_ele).css('background-color', '#999');
                $('#result').append('<span class="number">' + josephus.kill_ele + '</span>');
                if (josephus.head == null) {
                    clearInterval(timer);
                }
            }, josephus.speed)
        } else {
            clearInterval(timer);
        }
    }
    //从文件导入进度
    function importFile() {
        var selectedFile = document.getElementById("files").files[0];
        var name = selectedFile.name;
        var size = selectedFile.size;
        console.log("文件名:" + name + "大小：" + size);

        var reader = new FileReader();
        reader.readAsText(selectedFile);

        reader.onload = function() {
            var temp = JSON.parse(this.result);
            var nodes = initElements(temp.n);
            var kill_arr = temp.kill_arr;

            var leftNode = nodes.filter(function(ele) {
                return kill_arr.indexOf(ele) == -1 ? ele : null
            })
            var circleList = initCircleList(leftNode, temp.head)
            josephus = new Josephus(circleList, temp.m, temp.n, temp.k, temp.speed, kill_arr)
            is_initJosephus = true;
            initResult(josephus);
            alert('导入成功,点击运行按钮开始运行');

        };
    };

    //使得动画的每个节点成圆形排列
    function formatCircle(container,item,radius) {
        //中心点横坐标
        var dotLeft = (container.width()) / 2;
        //中心点纵坐标
        var dotTop = (container.height()) / 2;
        console.log(dotLeft, dotTop, item.length)
        //起始角度
        var stard = 0;
        //半径
        var radius = radius;
        //每一个BOX对应的角度;
        var avd = 360 / item.length;
        //每一个BOX对应的弧度;
        var ahd = avd * Math.PI / 180;
        //设置圆的中心点的位置
        item.each(function(index, element) {
            $(this).css({ "left": Math.sin((ahd * index)) * radius + dotLeft, "top": Math.cos((ahd * index)) * radius + dotTop });
        });
    }

})