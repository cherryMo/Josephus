$(document).ready(function() {
    //全局变量，判断josephus是否初始化
    is_initJosephus = false;

    $('#reset').click(function() {
        initJosephus();
        showRunProcess(josephus);
    })

    $('#start-run').click(function() {
        if (!is_initJosephus) {
            initJosephus()
        }
        showRunProcess(josephus)

    })

    $('#pause').click(function() {
        clearInterval(timer);
        console.log(josephus);
    })

    $('#save').click(function() {
        $('#pause').trigger('click');
        var temp = josephus;
        temp.head = josephus.head.element;
        var content = JSON.stringify(temp);
        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "josephus.json");
    })

    $('#load-state').click(function() {
        $('#files').trigger('click');
    })

    $('#files').change(function() {
        importFile();
    })


    function initItems(nodes) {
        $('#nodes').html('')
        for (var i = 0; i < nodes.length; i++) {
            $('#nodes').append('<span class="item" id="' + nodes[i] + '">' + nodes[i] + '</span>')
        }
    }

    function initJosephus() {
        var n = parseInt($('#n').val()); //n 总人数
        var k = parseInt($('#k').val()); //从编号为k的开始报数
        var m = parseInt($('#m').val()); //数到3的出列
        var speed = parseInt($('#speed').val()); //动画速度，单位是ms
        var nodes = initElements(n);
        var cirLinkList = circleList(nodes, k);

        //josephus定义为全局变量便于存储
        josephus = new Josephus(cirLinkList, m, n, k, speed);
        is_initJosephus = true;
    }

    function initResult(josephus) {
        var kill_arr = josephus.kill_arr;
        var all_arr = initElements(josephus.n);
        initItems(all_arr);
        $('#result').html('');
        for (var i = 0; i < kill_arr.length; i++) {
            $('#' + kill_arr[i]).css('background-color', '#999');
            $('#result').append('<span class="number">' + kill_arr[i] + '</span>')
        }
    }

    function initCircleList(ele_arr, k) {
        return circleList(ele_arr, k);
    }

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
            alert('导入成功,点击运行按钮开始运行')

        };
    };


})