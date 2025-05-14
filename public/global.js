const loader = document.createElement('div');
loader.className = 'w-full h-full flex flex-col justify-center items-center absolute start-0 top-0 text-[6px] bg-white';
loader.innerHTML = `
    <div class="loader mb-[.5em]"></div>
    <a href="/" class="text-[3.5em] text-indigo-600 cursor-pointer hover:text-indigo-500" style="font-family: fugaz one;">Blogify</a>
`;

function getLoaderElement(tailwwindStyles) {
    const position = tailwwindStyles && tailwwindStyles.position ? tailwwindStyles.position : 'absolute';
    const fontSize = tailwwindStyles && tailwwindStyles.fontSize ? tailwwindStyles.fontSize : 'text-[6px]';
    const marginTop = tailwwindStyles && tailwwindStyles.marginTop ? tailwwindStyles.marginTop : '';
    const marginBottom = tailwwindStyles && tailwwindStyles.marginBottom ? tailwwindStyles.marginBottom : '';
    const loader = document.createElement('div');
    loader.className = `w-full h-full flex flex-col justify-center items-center ${position} start-0 top-0 ${fontSize} ${marginTop} ${marginBottom} bg-white`;
    loader.innerHTML = `
        <div class="loader mb-[.5em]"></div>
        <a href="/" class="text-[3.5em] text-indigo-600 cursor-pointer hover:text-indigo-500" style="font-family: fugaz one;">Blogify</a>
    `;
    return loader;
}

// Confirmation Dialog
function confDialog(header, body, actionText, action) {
    const confDialog = document.querySelector('#conf_dialog');
    const confDialogHeader = confDialog.querySelector('.conf-dialog-header');
    const confDialogBody = confDialog.querySelector('.conf-dialog-body');
    const confDialogAction = confDialog.querySelector('.conf-dialog-action');

    // Clear confirmation dialog
    confDialogHeader.innerHTML = '';
    confDialogBody.innerHTML = '';
    confDialogAction.innerHTML = '';

    // Close confirmation dialog
    if(!confDialog.classList.contains('hidden')) {
        confDialog.classList.add('hidden');
        return;
    }

    if(!header || !body || !actionText || !action) {
        confDialog.classList.add('hidden');
        return;
    }

    // Open confirmation dialog
    confDialogHeader.innerHTML = header;
    confDialogBody.innerHTML = body;
    confDialogAction.innerHTML = actionText;
    confDialogAction.onclick = action;
    confDialog.classList.remove('hidden');
}

// Remove loader
setTimeout(() => {
    document.querySelector('#page_loader')?.remove();
}, 500);

// Dropdown toggle
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const dropdown = toggle.closest('.dropdown');
        dropdown.querySelector('.dropdown-menu')?.classList.toggle('show');
    });
});

function handleDropdownToggle(event) {
    const dropdown = event.target.closest('.dropdown');
    dropdown.querySelector('.dropdown-menu')?.classList.toggle('show');
}

// Click outside dropdown menu to close
document.addEventListener('click', (e) => {
    const target = e.target;
    const isDropdownChild = target.closest('.dropdown');
    const isDropdownToggle = target.classList.contains('dropdown-toggle');
    if(!isDropdownChild && !isDropdownToggle) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        })
    }
})

// Time ago
function timeAgo(timestamp) {
    const currentTime = new Date();
    const givenTime = new Date(timestamp);

    const differenceInSeconds = Math.floor((currentTime - givenTime) / 1000);

    if(differenceInSeconds < 1) {
        return 'just now';
    }

    if (differenceInSeconds < 60) {
        return `${differenceInSeconds} second${differenceInSeconds > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 604800) { // 7 days
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 2628000) { // ~1 month (30.44 days)
        const weeks = Math.floor(differenceInSeconds / 604800);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 31536000) { // ~1 year (365.25 days)
        const months = Math.floor(differenceInSeconds / 2628000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(differenceInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

// Accept friend request
async function acceptFriendRequest(user_id) {
    return fetch(`/api/friend-request/accept/${user_id}`)
    .then(response => {
        if(!response.ok) throw new Error('Failed to accept friend request');
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        throw error;
    });
}

// Reject friend request
async function rejectFriendRequest(user_id) {
    return fetch(`/api/friend-request/reject/${user_id}`)
    .then(response => {
        if(!response.ok) throw new Error('Failed to reject friend request');
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        throw error;
    });
}

// Unsend friend request
async function unsendFriendRequest(user_id) {
    return fetch(`/api/friend-request/unsend/${user_id}`)
    .then(response => {
        if(!response.ok) throw new Error('Failed to unsend friend request');
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        throw error;
    });
}

// Toast
const toastIconHTML = {
    "success": `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="toast-icon icon icon-tabler icons-tabler-filled icon-tabler-circle-check fill-green-600">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
    </svg>
    `,
    "error": `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="toast-icon icon icon-tabler icons-tabler-filled icon-tabler-exclamation-circle fill-red-600">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 11.66a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -7a1 1 0 0 0 -1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1" />
    </svg>
    `,
    "info": `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="toast-icon icon icon-tabler icons-tabler-filled icon-tabler-info-circle fill-blue-600">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
    </svg>
    `
}
const toastSidebarHTML = {
    "success": `<div class="toast-sidebar absolute h-full w-[5px] bg-green-600 start-[-1px] top-0"></div>`,
    "error": `<div class="toast-sidebar absolute h-full w-[5px] bg-red-600 start-[-1px] top-0"></div>`,
    "info": `<div class="toast-sidebar absolute h-full w-[5px] bg-blue-600 start-[-1px] top-0"></div>`
}