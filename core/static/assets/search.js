// function for Read more buttons
function myFunction(postid) {
    let dots = document.querySelector(` .card[data="${postid}"] .dots`);
    let moreText = document.querySelector(`.card[data="${postid}"] .more`);
    let btnText = document.querySelector(`.card[data="${postid}"] .myBtn`);
    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
    }

}
function myFunction(commentid) {
    let dots = document.querySelector(` .card[data="${commentid}"] .dots`);
    let moreText = document.querySelector(`.card[data="${commentid}"] .more`);
    let btnText = document.querySelector(`.card[data="${commentid}"] .myBtn`);


    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
    }

}

// function to append div 
let getElementFromString = (string) => {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}
// function to clear last elements before searching the next
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

//Submit button
const buttton = document.getElementById('submitButton');
buttton.addEventListener('click', () => {
    clearBox('postBox')
    clearBox('pagination')
    // clearBox('')
    let filter = document.querySelector("input[name='f']:checked").value;
    let post = document.getElementById('posts');
    let comment = document.getElementById('comments');
    let form = document.getElementById('subreddits').value;
    let search = document.getElementById('search').value;
    if (search == '') {
        document.getElementById('invalid').style.display = 'block'
    }
    else {
        document.getElementById('invalid').style.display = 'none'
        //Api according to checked value in the filter
        //if both are checked
        if (post.checked && comment.checked) {
            let filterValue = 'pc'
            fetch('/search?f=' + filterValue + '&sub=' + form + '&q=' + search, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    let previous = data.previous
                    let next = data.next
                    console.log(data)
                    let count = data.count
                    let page = count / 4
                    let precision = page.toPrecision(2);
                    let pageNumber;
                    let totalPage;
                    if (precision <= 1) {
                        totalPage = 1;
                    }
                    else {
                        totalPage = Math.round(precision)
                    }
                    if (previous == null ) {
                        pageNumber = 1;
                    }
                    else if (previous == null) {
                        pageNumber = next - 1;
                    }
                    else if (next == null) {
                        pageNumber = previous + 1;
                    }
                    else{
                        pageNumber = next - 1;
                    }
                    if (count == 0) {
                        document.getElementById('pagination').innerHTML += "No results!!!";
                        document.getElementById('pagination').style.fontSize = '30px';
                        document.getElementById('pagination').style.marginLeft = '150px';
                    }
                    else{
                        document.getElementById('pagination').innerHTML += "Page " + pageNumber + " of " + totalPage;
                    }
                    document.getElementById('pagination').style.display = 'block';
                    if (totalPage == 1) {
                        document.getElementById('next').style.display = 'none';
                        document.getElementById('last').style.display = 'none';
                        document.getElementById('first').style.display = 'none';
                        document.getElementById('previous').style.display = 'none';
                    }
                    else if (totalPage > pageNumber) {
                        document.getElementById('next').style.display = 'block';
                        document.getElementById('last').style.display = 'block';
                    }
                    else if (totalPage == pageNumber) {
                        document.getElementById('first').style.display = 'block';
                        document.getElementById('previous').style.display = 'block';
                    }
                    let datas = data.data
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
                        let shortDate = date.slice(0, 10)
                        username = datas[i].username;
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
                            <a href="https://reddit.com/u/${username}" class="a-comment">
                                <span class="">${username}</span>
                            </a>
                            <span class="mx-1">|</span>
    
    <!--                     REDDIT LINK-->
                            <i class="fas fa-sign-out-alt"></i>
                            <a href="https://reddit.com/r/sub/comments/${post_id}" class="a-comment">
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
                                <span id="postContent" class="full-content text-break"  >
                               ${shortText}
                                </span>
       
            <!--                DOTS -->
                               <span class="dots">...</span>
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
                                <a href="https://reddit.com/u/${username}" class="a-comment">
                                    <span class="">${username}</span>
                                </a>
                                <span class="mx-1">|</span>
        
        <!--                     REDDIT LINK-->
                                <i class="fas fa-sign-out-alt"></i>
                                <a href="https://reddit.com/r/{{object.sub}}/comments/${post_id}/_/${comment_id}" class="a-comment">
                                    <span class="">View on Reddit</span>
                                </a>
                            </p>
        
        
        
        <!--                FULL CONTENT -->
                        <span id="commentContent" class="full-content text-break"  >
                        ${shortText}
                        </span>
        
        <!--                DOTS -->
                        <span class="dots">...</span>
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
                });
        }
        //if comment is checked
        else if (comment.checked) {
            fetch('/search?f=' + filter + '&sub=' + form + '&q=' + search, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    let previous = data.previous
                    let count = data.count
                    let page = count / 12
                    let precision = page.toPrecision(2);
                    let pageNumber;
                    let totalPage;
                    if (precision <= 1) {
                        totalPage = 1;
                    }
                    else {
                        totalPage = Math.round(precision)
                    }
                    if (previous == null ) {
                        pageNumber = 1;
                    }
                    else if (previous == null) {
                        pageNumber = next - 1;
                    }
                    else if (next == null) {
                        pageNumber = previous + 1;
                    }
                    else{
                        pageNumber = next - 1;
                    }
                    if (count == 0) {
                        document.getElementById('pagination').innerHTML += "No results!!!";
                        document.getElementById('pagination').style.fontSize = '30px';
                        document.getElementById('pagination').style.marginLeft = '150px';
                    }
                    else{
                        document.getElementById('pagination').innerHTML += "Page " + pageNumber + " of " + totalPage;
                    }
                    document.getElementById('pagination').style.display = 'block';
                    // console.log(true)
                    if (totalPage == 1) {
                        document.getElementById('next').style.display = 'none';
                        document.getElementById('last').style.display = 'none';
                        document.getElementById('first').style.display = 'none';
                        document.getElementById('previous').style.display = 'none';
                    }
                    else if (totalPage > pageNumber) {
                        document.getElementById('next').style.display = 'block';
                        document.getElementById('last').style.display = 'block';
                    }
                    else if (totalPage == pageNumber) {
                        document.getElementById('first').style.display = 'block';
                        document.getElementById('previous').style.display = 'block';
                    }
                    let datas = data.data
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
                        let shortDate = date.slice(0, 10)
                        username = datas[i].username;

                        let box1 = document.getElementById('commentBox');
                        let string = `<div class="post-comments card" data=${comment_id}>
                                <p class="meta">
        
            <!--                    COMMENT OR POST ICON -->
                                    <i class="far fa-comments"
                                       style="font-size: 1.4rem!important; margin-right: 10px;">
                                    </i>
            
            <!--                    USERNAME -->
                                    <i class="fas fa-user"></i>
                                    <a href="https://reddit.com/u/${username}" class="a-comment">
                                        <span class="">${username}</span>
                                    </a>
                                    <span class="mx-1">|</span>
        
            <!--                     REDDIT LINK-->
                                    <i class="fas fa-sign-out-alt"></i>
                                    <a href="https://reddit.com/r/{{object.sub}}/comments/${post_id}/_/${comment_id}" class="a-comment">
                                        <span class="">View on Reddit</span>
                                    </a>
                                </p>
        
            <!--                FULL CONTENT -->
                            <span id="commentContent" class="full-content text-break"  >
                            ${shortText}
                            </span>
            
            <!--                DOTS -->
                            <span class="dots">...</span>
                            <span class="more"  style = "display:none">${text}</span>
            
            <!--                READ MORE AND DATE -->
                                <div class="text-end mt-1 mx-2" style="font-size: 0.9rem;">
                                    <button   class="nav-toggle text-muted mx-2 border-0 myBtn" style="cursor:pointer" onclick="myFunction('${comment_id}')"  >
                                         Read More
                                    </button>|
                                    <span class="text-muted">
                                        ${shortDate}
                                    </span>
                                </div>
                            </div>`
                        let commentElement = getElementFromString(string);
                        // console.log(parameterElement);
                        box1.appendChild(commentElement)
                    }




                });
        }
        //if post is checked
        else if (post.checked) {
            fetch('/search?f=' + filter + '&sub=' + form + '&q=' + search, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    let previous = data.previous
                    let count = data.count
                    let page = count / 12
                    let precision = page.toPrecision(2);
                    let pageNumber;
                    let totalPage;
                    if (precision <= 1) {
                        totalPage = 1;
                    }
                    else {
                        totalPage = Math.round(precision)
                    }
                    if (previous == null ) {
                        pageNumber = 1;
                    }
                    else if (previous == null) {
                        pageNumber = next - 1;
                    }
                    else if (next == null) {
                        pageNumber = previous + 1;
                    }
                    else{
                        pageNumber = next - 1;
                    }
                    if (count == 0) {
                        document.getElementById('pagination').innerHTML += "No results!!!";
                        document.getElementById('pagination').style.fontSize = '30px';
                        document.getElementById('pagination').style.marginLeft = '150px';
                    }
                    else{
                        document.getElementById('pagination').innerHTML += "Page " + pageNumber + " of " + totalPage;
                    }
                    document.getElementById('pagination').style.display = 'block';
                    // console.log(true)
                    if (totalPage == 1) {
                        document.getElementById('next').style.display = 'none';
                        document.getElementById('last').style.display = 'none';
                        document.getElementById('first').style.display = 'none';
                        document.getElementById('previous').style.display = 'none';
                    }
                    else if (totalPage > pageNumber) {
                        document.getElementById('next').style.display = 'block';
                        document.getElementById('last').style.display = 'block';
                    }
                    else if (totalPage == pageNumber) {
                        document.getElementById('first').style.display = 'block';
                        document.getElementById('previous').style.display = 'block';
                    }
                    let datas = data.data
                    let post_id;
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
                        let shortDate = date.slice(0, 10)
                        username = datas[i].username;

                        let box2 = document.getElementById('postBox');
                        let string = ` <div class="post-comments card"  data=${post_id} >
                                    <p class="meta">
                
                <!--                    COMMENT OR POST ICON -->
                                        <i class="far fa-newspaper"
                                           style="font-size: 1.4rem!important; margin-right: 10px;">
                                        </i>
                
                <!--                    USERNAME -->
                                        <i class="fas fa-user"></i>
                                        <a href="https://reddit.com/u/${username}" class="a-comment">
                                            <span class="">${username}</span>
                                        </a>
                                        <span class="mx-1">|</span>
                
                <!--                     REDDIT LINK-->
                                        <i class="fas fa-sign-out-alt"></i>
                                        <a href="https://reddit.com/r/sub/comments/${post_id}" class="a-comment">
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
                                            <span id="postContent" class="full-content text-break"  >
                                           ${shortText}
                                            </span>
                   
                        <!--                DOTS -->
                                           <span class="dots">...</span>
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
                        let postElement = getElementFromString(string);
                        // console.log(parameterElement);
                        box2.appendChild(postElement);
                    }

                    // console.log('post')

                });
        }
    }

})
