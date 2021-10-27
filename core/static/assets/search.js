//toggle switch between dark and light mode
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
let image
function switchTheme(e) {
    apiCall();
    var body = document.getElementsByTagName('body')[0];
    var light = $('#light-mode')
    var dark = $('#dark-mode')
    image = 'white'

    if (e.target.checked) {
        body.setAttribute('data-theme', 'dark');
        light.removeAttr('hidden')
        dark.attr('hidden', true)
        image = 'dark'
    }
    else {
        body.setAttribute('data-theme', 'light');
        light.attr('hidden', true)
        dark.removeAttr('hidden')
        image = 'white'
    }

}

toggleSwitch.addEventListener('change', switchTheme, false);

//button click on enter press
function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        buttonClick()
    }
}
// validation function to check for empty values
function validation() {
    let search = document.getElementById('search');
    let post = document.getElementById('posts');
    let comment = document.getElementById('comments');
    let postValid = document.getElementById('postValid');
    let commentValid = document.getElementById('commentValid');
    if (search.value === '') {
        search.style.border = '2px solid red'
        document.getElementById('invalidText2').style.display = 'block'
    }
    else {
        search.style.border = '0.6px solid #808080'
        document.getElementById('invalidText2').style.display = 'none'

    }
    if (post.checked === false && comment.checked === false) {
        postValid.style.border = '2px solid red'
        commentValid.style.border = '2px solid red'
        document.getElementById('invalidText1').style.display = 'block'

    }
    else {
        postValid.style.border = '1px  black'
        commentValid.style.border = '1px  black'
        document.getElementById('invalidText1').style.display = 'none'


    }
}

//function to change the content according to change in the url
window.onload = () => {
    let url = window.location.href;
    url = url.split('?').pop();
    const argArray = new URLSearchParams(url)
    let query = argArray.has('q') ? argArray.get('q') : '' // if query exists set query='query from url' else ''
    let filter = argArray.has('f') ? argArray.get('f') : ''
    let sub = argArray.has('sub') ? argArray.get('sub') : ''
    //to check the conditions before calling the api
    if (query !== '' && (filter[0] == "c" || filter[0] == "p") && sub !== '') {
        validation();
        if (filter[0] === 'c') {
            document.getElementById('comments').checked = true
            document.getElementById('posts').checked = false
        }
        else if (filter[1] === 'c') {
            document.getElementById('comments').checked = true
            document.getElementById('posts').checked = true
        }
        document.getElementById('search').value = query;
        document.getElementById('subreddits').value = sub;
        apiCall()
    }
}

//function after submit button is clicked
function buttonClick() {
    let search = document.getElementById('search').value;
    let post = document.getElementById('posts');
    let comment = document.getElementById('comments');
    let form = document.getElementById('subreddits').value;
    let filterValue;
    //to check the conditions before pushing the url
    if (post.checked && comment.checked) {
        filterValue = 'pc'
    }
    else if (post.checked) {
        filterValue = 'p'
    }
    else if (comment.checked) {
        filterValue = 'c'
    }
    //to check the conditions before calling the api
    if (search != '' && (post.checked || comment.checked) && form != '') {
        history.pushState(null, "", '/search?f=' + filterValue + '&sub=' + form + '&q=' + search + '&page=1');
        apiCall()

    }
    else validation();
}

// function to clear contents in the results before searching the next result
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
    document.getElementById(elementID).style = "";
}

function executionTime(sec) {
    document.getElementById('execTime').innerHTML = 'Execution: ' + sec;
}
// api call function
function apiCall() {
    let url = window.location.href;
    url = url.split('?').pop();
    let start = performance.now()
    validation();
    clearBox('postBox')
    clearBox('commentBox')
    clearBox('pagination')
    clearBox('results')
    const argArray = new URLSearchParams(url)
    let page = argArray.has('page') ? argArray.get('page') : ''
    if (page === '') {
        let url1 = 'search?' + url + '&page=1'
        history.pushState(null, "", url1);
        url =  url + '&page=1'
        // console.log(url)
    }
    document.getElementById('loading').style.display = "block";
    fetch('/api?' + url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = "none";
            // console.log(start)
            let end = performance.now()
            // console.log(end)
            let time = end - start
            time = Math.round(time)
            let sec = Math.floor((time / 1000) % 60);
            sec = sec + '.' + time + ' seconds'
            executionTime(sec)
            dataCollection(data);
            dataAppender(data);
        });
}

//function to control the data inside the content
function dataCollection(data) {
    let previous = data.prev
    let next = data.next
    let count = data.count
    let paginatedValue = 25;
    let paginatedOrphan = 4;
    let totalPage;
    let pageNumber;
    // to display the next, previous, last and first
    document.getElementById('next').style.display = 'block';
    document.getElementById('last').style.display = 'block';
    document.getElementById('first').style.display = 'block';
    document.getElementById('previous').style.display = 'block';

    //for result found in the content section
    if (count != 0) {
        document.getElementById('results').innerHTML += count + ' results found'
    }

    // to find the page number and total pages
    let page = count / paginatedValue
    let precision = Math.round(page * 100) / 100;
    let precisionDecimalval = precision - Math.floor(precision);
    //if remaining objects in database is less than or equal to paginatedOrphan + paginatedValue then count of data will be paginatedValue + paginatedOrphan
    let n = Math.floor((paginatedValue + paginatedOrphan) / paginatedValue)
    n = ((paginatedValue + paginatedOrphan) / paginatedValue) - n
    //Calculation for total pages
    if (precision <= 1) {
        totalPage = 1;
    }
    //to compare the decimal values of precision and n because the decimal values of precision is less than or equal to the value of n
    else if (precisionDecimalval <= n) {
        totalPage = Math.floor(precision)
    }
    else {
        totalPage = Math.ceil(precision)
    }

    // Calculating the value of the present page
    if (previous == null) {
        pageNumber = 1;
    }
    else if (next == null) {
        pageNumber = previous + 1;
    }
    else {
        pageNumber = next - 1;
    }

    // to display the pagination bar according to the count
    if (count == 0) {
        document.getElementById('pagination').innerHTML += "No results!!!";
        document.getElementById('pagination').style.fontSize = '50px';
        document.getElementById('next').style.display = 'none';
        document.getElementById('last').style.display = 'none';
        document.getElementById('first').style.display = 'none';
        document.getElementById('previous').style.display = 'none';
    }
    else {
        document.getElementById('pagination').innerHTML += "Page " + pageNumber + " of " + totalPage;
    }
    document.getElementById('pagination').style.display = 'block';

    // to show next,last,previous and first button according to the requirements
    if (previous == null && next == null) {
        document.getElementById('next').style.display = 'none';
        document.getElementById('last').style.display = 'none';
        document.getElementById('first').style.display = 'none';
        document.getElementById('previous').style.display = 'none';
    }
    else if (previous == null) {
        document.getElementById('next').style.display = 'block';
        document.getElementById('last').style.display = 'block';
        document.getElementById('first').style.pointerEvents = 'none'
        document.getElementById('previous').style.pointerEvents = 'none'
        document.getElementById('first').style.opacity = '0'
        document.getElementById('previous').style.opacity = '0'
    }
    else if (next == null) {
        document.getElementById('next').style.pointerEvents = 'none'
        document.getElementById('last').style.pointerEvents = 'none'
        document.getElementById('next').style.opacity = '0'
        document.getElementById('last').style.opacity = '0'
        document.getElementById('first').style.display = 'block';
        document.getElementById('previous').style.display = 'block';
    }

    //to send href to the a tag of next,last,previous and first according to the page number
    let url = window.location.href
    url = url.replace(/&page.+$/, `&page=${pageNumber + 1}`)
    document.getElementById('next').href = url
    url = url.replace(/&page.+$/, `&page=${totalPage}`)
    document.getElementById('last').href = url
    url = url.replace(/&page.+$/, `&page=${pageNumber - 1}`)
    document.getElementById('previous').href = url
    url = url.replace(/&page.+$/, `&page=1`)
    document.getElementById('first').href = url
}

// function to control read more and read less inside the div
function myFunction(id) {
    let dots = document.querySelector(` .card[data="${id}"] .dots`);
    let moreText = document.querySelector(`.card[data="${id}"] .more`);
    let btnText = document.querySelector(`.card[data="${id}"] .myBtn`);
    let shorttext = document.querySelector(`.card[data="${id}"] .Text`);
    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
        shorttext.style.display = 'inline';
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
        shorttext.style.display = 'none';
    }
}

// function to append the div inside the content according to the results
function dataAppender(data) {
    let datas = data.data
    let title;
    let type;
    let post_id;
    let comment_id;
    let text;
    let username;
    let createDate;
    let deleteDate;
    let imageUrl;
    let upVotes;
    let sub;
    // for loop to show the values in different div tag
    for (var i = 0; i < datas.length; i++) {
        type = datas[i].type; //type of data (post or comment)
        post_id = datas[i].post_id; //PostID from the data
        comment_id = datas[i].comment_id;//CommentID from the data
        //text and title
        title = datas[i].title;
        text = datas[i].text;
        sub = datas[i].sub;
        let shortText = text.slice(0, 150)//shortening the text for comment section
        //distributing date according to create and delete date
        //createDate
        createDate = datas[i].create_date;
        let date;
        let hour;
        let minutes;
        if (createDate == null) {
            date = ''
            hour = ''
            minutes = ''
        }
        else {
            date = createDate.slice(0, 10)
            date = date.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1")
            hour = createDate.split('T').pop().split(':')[0]
            minutes = createDate.slice(13, 16)
            minutes = minutes + ' | '
        }
        //deleteDate
        let deldate;
        let delhour;
        let delminutes;
        deleteDate = datas[i].delete_date;
        if (deleteDate === null) {
            deldate = ''
            delhour = ''
            delminutes = ''
        }
        else {
            deldate = deleteDate.slice(0, 10)
            deldate = deldate.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1")
            delhour = deleteDate.split('T').pop().split(':')[0]
            delminutes = deleteDate.slice(13, 16)
            delminutes = delminutes + ' | '
        }
        //Image for the post tag
        imageUrl = datas[i].image_url;
        let mode = image
        if (imageUrl == null) {
             if(mode == 'dark'){
                 imageUrl = '/static/assets/notfound.png'
             }
             else{
                imageUrl = '/static/assets/not-found.png'
             }
        }
        
        upVotes = datas[i].upvotes;//upvotes from the data
        username = datas[i].username;//username

        //used to append div inside the data appender function
        let getElementFromString = (string) => {
            let div = document.createElement('div');
            div.innerHTML = string;
            return div.firstElementChild;
        }
        // According to the types if both are called together
        if (type == 'post') {
            let postBox = document.getElementById('postBox');
            let postString = `<div class="post-comments card"  data=${post_id} >
            <p class="meta">
    
            <!--                    COMMENT OR POST ICON -->
                <i class="far fa-newspaper"
                   style="font-size: 1.4rem!important; margin-right: 10px;">
                </i>
    
                <!--                    USERNAME -->
                <i class="fas fa-user"></i>
                <a href="https://reddit.com/u/${username}" target="_blank" class="a-comment">
                <span class="">${username}</span>
                </a>
                <span class="mx-1">|</span>
                
    <!--                     REDDIT LINK-->
    <i class="fas fa-sign-out-alt"></i>
    <a href="https://reddit.com/r/${sub}/comments/${post_id}" target="_blank" class="a-comment">
    <span class="">View on Reddit</span>
    </a>
            </p>
            <div class="row">
            
            <!--                    THUMBNAIL -->
                <div class="col-3  text-center">
                <img class="img thumbnail" width='75px' height="55px"
                src=${imageUrl} alt="Image not found" />
                    <p class="text-muted mb-0 p-0 me-5 ">
                    </p>
                    <small class="mx-1  mb-0 p-0 "><i class="fas fa-thumbs-up"></i></small>
                    <small class="me-3  mb-0 p-0" >${upVotes}</small>
                    </div>
    
                <div class="col-9">
                <!--                FULL CONTENT -->
    
                    <div style="font-weight: bold;">
                    ${title}
                   </div>
                   <span id="postContent" class="full-content Text text-break"  >
                   <span class="dots"> ...</span>
                    </span>
                    
    <!--                DOTS -->
                   <span class="more"  style = "display:none">${text}</span>
                   
    
    <!--                READ MORE AND DATE -->
    <div class="text-end mt-4 mx-2" style="font-size: 0.9rem;">
    <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Create Date" style="font-size: 12px; cursor:default;">
          ${date} ${hour}${minutes}               
    </span>
    <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Date" style="font-size: 12px; cursor:default;">
        ${deldate} ${delhour}${delminutes} 
        </span>
                        <button   class="nav-toggle  mx-2  border-0 myBtn" style="margin-left: -30px; cursor: pointer;" onclick="myFunction('${post_id}')"  >
                        Read More
                        </button>
                            </div>
                </div>
                </div>
        </div>`
            let postElement = getElementFromString(postString);
            postBox.appendChild(postElement);
        }
        else if (type == 'comment') {

            let commentBox = document.getElementById('commentBox');
            let commentString = `<div class="post-comments card" data=${comment_id}>
                <p class="meta">
                
    <!--                    COMMENT OR POST ICON -->
                    <i class="far fa-comments"
                    style="font-size: 1.4rem!important; margin-right: 10px;">
                    </i>
                    
    <!--                    USERNAME -->
    <i class="fas fa-user"></i>
                    <a href="https://reddit.com/u/${username}" target="_blank" class="a-comment">
                    <span class="">${username}</span>
                    </a>
                    <span class="mx-1">|</span>
    
    <!--                     REDDIT LINK-->
    <i class="fas fa-sign-out-alt"></i>
    <a href="https://reddit.com/r/${sub}/comments/${post_id}/_/${comment_id}" target="_blank" class="a-comment">
                        <span class="">View on Reddit</span>
                    </a>
                    </p>
    
                    
                        
                        
                    
    <!--                FULL CONTENT -->
            <span id="commentContent"  class="full-content text-break Text mb-3"  >
            ${shortText}
            <span class="dots"> ...</span>
            </span>
    
            <!--                DOTS -->
            <span class="more mb-3"  style = "display:none" >${text}</span>
            
               
            
    <!--                READ MORE AND DATE -->
    
                       
                <div class="text-end mt-1 mx-2" style="font-size: 0.9rem;">
                <p class ="  float-start">
                <small class="mx-1 "><i class="fas fa-thumbs-up"></i></small>
                  <small class="mt-1 ">${upVotes}</small>
                </p>
                <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Create Date" style="font-size: 12px; cursor:default;">
                        ${date} ${hour}${minutes}
                        </span>
                        <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Date" style="font-size: 12px; cursor:default;">
                        ${deldate} ${delhour}${delminutes} 
                            </span>
                    <button   class="nav-toggle  mx-2 border-0 myBtn " style="cursor:pointer" onclick="myFunction('${comment_id}')"  >
                    Read More
                        </button>
                    
                </div>
    
            </div>`
            let commentElement = getElementFromString(commentString);
            commentBox.appendChild(commentElement)
        }
    }
}
