// validation function to check for empty values
function validation() {
    let search = document.getElementById('search');
    if (search.value == '') {
        search.style.border = '2px solid red'
    }
    else {
        search.style.border = '1px  black'
    }
}

// function to clear contents in the results before searching the next result
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
    document.getElementById(elementID).style = "";
}

//function to change the content according to change in the url
window.onload = () => {
    let url = window.location.href;
    url = url.split('?').pop();
    let searchBar = url.split('q=').pop().split('&')[0];
    let filterBar = url.split('f=').pop();

    //to check the conditions before calling the api
    if (searchBar[0] != '' && filterBar[0] == "c" || filterBar[0] == "p") {
        apiCall(url)
        if (filterBar[0] == 'c') {
            document.getElementById('comments').checked = true
            document.getElementById('posts').checked = false
        }
        else if (filterBar[1] == 'c') {
            document.getElementById('comments').checked = true
            document.getElementById('posts').checked = true
        }
        document.getElementById('search').value = searchBar;
        validation();
    }
}

//function after submit button is clicked
function buttonClick() {
    clearBox('postBox')
    clearBox('commentBox')
    clearBox('pagination')
    clearBox('results')
    let filter = document.querySelector("input[name='f']:checked").value;
    let search = document.getElementById('search').value;
    let post = document.getElementById('posts');
    let comment = document.getElementById('comments');
    let form = document.getElementById('subreddits').value;
    let filterValue;
    validation();

    //to check the conditions before pushing the url
    if (post.checked && comment.checked) {
        filterValue = 'pc'
        history.pushState(null, "", '/search?f=' + filterValue + '&sub=' + form + '&q=' + search + '&page=1');
    }
    else if (post.checked || comment.checked) {
        history.pushState(null, "", '/search?f=' + filter + '&sub=' + form + '&q=' + search + '&page=1');
    }
    let url = window.location.href
    url = url.split('?').pop();
    validation();
    //to check the conditions before calling the api
    if (search != '' && post.checked || comment.checked) {
        // console.log('hi')
        apiCall(url)
    }
}

// api call function
function apiCall(url) {
    validation()
    fetch('/api?' + url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            dataCollection(data);
            dataAppender(data);
        });

}

//function to control the data inside the content
function dataCollection(data) {
    let previous = data.previous
    let next = data.next
    let count = data.count
    let paginatedValue = 4
    let totalPage;
    let pageNumber;
    
    //for result found in the content section 
    if (count != 0) {
        document.getElementById('results').innerHTML += count + ' results found'
    }
    
    // to find the page number and total pages
    let page = count / paginatedValue
    let precision = page.toPrecision(2);
    if (precision <= 1) {
        totalPage = 1;
    }
    else {
        totalPage = Math.round(precision)
    }
    if (previous == null) {
        pageNumber = 1;
    }
    else if (previous == null) {
        pageNumber = next - 1;
    }
    else if (next == null) {
        pageNumber = previous + 1;
    }
    else {
        pageNumber = next - 1;
    }
    if (count == 0) {
        document.getElementById('pagination').innerHTML += "No results!!!";
        document.getElementById('pagination').style.fontSize = '30px';
        document.getElementById('pagination').style.marginLeft = '150px';
    }
    else {
        document.getElementById('pagination').innerHTML += "Page " + pageNumber + " of " + totalPage;
    }
    document.getElementById('pagination').style.display = 'block';

    // to show next,last,previous and first button according to the requirements
    if (count == paginatedValue) {
        document.getElementById('next').style.display = 'none';
        document.getElementById('last').style.display = 'none';
        document.getElementById('first').style.display = 'none';
        document.getElementById('previous').style.display = 'none';
    }
    else if (count == 0) {
        document.getElementById('next').style.display = 'none';
        document.getElementById('last').style.display = 'none';
        document.getElementById('first').style.display = 'none';
        document.getElementById('previous').style.display = 'none';
    }
    else if (previous == null) {
        document.getElementById('pagination').style.marginLeft = '210px'
        document.getElementById('next').style.marginLeft = '170px'
        document.getElementById('next').style.display = 'block';
        document.getElementById('last').style.display = 'block';
        document.getElementById('first').style.display = 'None';
        document.getElementById('previous').style.display = 'None';
    }
    else if (next == null) {
        document.getElementById('pagination').style.marginLeft = '105px'
        document.getElementById('next').style.display = 'None';
        document.getElementById('last').style.display = 'None';
        document.getElementById('first').style.display = 'block';
        document.getElementById('previous').style.display = 'block';
    }
    else {
        document.getElementById('pagination').style.marginLeft = '110px'
        document.getElementById('next').style.marginLeft = '120px'
        document.getElementById('next').style.display = 'block';
        document.getElementById('last').style.display = 'block';
        document.getElementById('first').style.display = 'block';
        document.getElementById('previous').style.display = 'block';
    }

    //to send href to the a tag of next,last,previousand first according to the page number
    let b = window.location.href
    b = b.replace(/&page.+$/, `&page=${pageNumber + 1}`)
    // console.log(b)
    document.getElementById('next').href = b
    b = b.replace(/&page.+$/, `&page=${totalPage}`)
    document.getElementById('last').href = b
    b = b.replace(/&page.+$/, `&page=${pageNumber - 1}`)
    document.getElementById('previous').href = b
    b = b.replace(/&page.+$/, `&page=1`)
    document.getElementById('first').href = b
}

// function to control readmore and read less inside the div
function myFunction(id) {
    let dots = document.querySelector(` .card[data="${id}"] .dots`);
    let moreText = document.querySelector(`.card[data="${id}"] .more`);
    let btnText = document.querySelector(`.card[data="${id}"] .myBtn`);
    let text = document.querySelector(`.card[data="${id}"] .Text`);


    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
        text.style.display = 'inline';

    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
        text.style.display = 'none';

    }

}

//used to append div inside the data appender function
let getElementFromString = (string) => {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
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
    let date;
    for (var i = 0; i < datas.length; i++) {
        type = datas[i].type;
        post_id = datas[i].post_id;
        comment_id = datas[i].comment_id;
        text = datas[i].text;
        let shortText = text.slice(0, 150)
        date = datas[i].date;
        date = date.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1")
        let shortDate = date.slice(0, 10)
        username = datas[i].username;
        title = datas[i].title;
        // According to the types if both are called together
        if (type == 'post') {
            let box2 = document.getElementById('postBox');
            let string2 = `<div class="post-comments card"  data=${post_id} >
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
    <a href="https://reddit.com/r/sub/comments/${post_id}" target="_blank" class="a-comment">
    <span class="">View on Reddit</span>
    </a>
            </p>
            <div class="row">
            
            <!--                    THUMBNAIL -->
                <div class="col-3  text-center">
                <img class="img thumbnail" width='75px' height="55px"
                src="https://b.thumbs.redditmedia.com/qTtigz4VcFX0pzdOJnG5HLKvLt3uoEWr-vZ0rvNEteQ.jpg"  alt="post-image"/>
                    <p class="text-muted mb-0 p-0">
                    <small class="mx-1 "><i class="fas fa-thumbs-up"></i></small>
                    <small class="mt-1">86</small>
                    </p>
                    </div>
    
                <div class="col-9">
                <!--                FULL CONTENT -->
    
                    <span>
                    ${title}
                   </span>
                   <span id="postContent" class="full-content Text text-break"  >
                   <span class="dots"> ...</span>
                    </span>
                    
    <!--                DOTS -->
                   <span class="more"  style = "display:none">${text}</span>
                   
    
    <!--                READ MORE AND DATE -->
    <div class="text-end mt-1 mx-2" style="font-size: 0.9rem;">
                        <button   class="nav-toggle text-muted mx-2 border-0 myBtn" style="cursor:pointer" onclick="myFunction('${post_id}')"  >
                        Read More
                        </button>|
                        <span class="text-muted">
                            ${shortDate}
                            </span>
                            </div>
                </div>
                </div>
        </div>`
            let postElement = getElementFromString(string2);
            // console.log(parameterElement);
            box2.appendChild(postElement);
        }
        else if (type == 'comment') {

            let box1 = document.getElementById('commentBox');
            let string1 = `<div class="post-comments card" data=${comment_id}>
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
    <a href="https://reddit.com/r/sub/comments/${post_id}/_/${comment_id}" target="_blank" class="a-comment">
                        <span class="">View on Reddit</span>
                    </a>
                    </p>
    
                    
                    
    <!--                FULL CONTENT -->
            <span id="commentContent"  class="full-content text-break Text"  >
            ${shortText}
            <span class="dots"> ...</span>
            </span>
    
            <!--                DOTS -->
            <span class="more"  style = "display:none">${text}</span>
            
               
            
    <!--                READ MORE AND DATE -->
    <div class="text-end mt-1 mx-2" style="font-size: 0.9rem;">
                    <button   class="nav-toggle text-muted mx-2 border-0 myBtn " style="cursor:pointer" onclick="myFunction('${comment_id}')"  >
                    Read More
                    </button>|
                    <span class="text-muted">
                        ${shortDate}
                        </span>
                </div>
            </div>`
            let commentElement = getElementFromString(string1);
            // console.log(parameterElement);
            box1.appendChild(commentElement)
        }
    }
}
