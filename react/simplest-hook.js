// learn from https://react.iamkasong.com/hooks/create.html#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86


/**
 * some introduction
 * 1. user action triggers 'update', 'update' stored in 'hook', 'hook' stored in 'fiber';
 * 2. there is a global variable called 'workInProgressHook', stores current hook, and move to next when finish last hook's update queue
 * 3. 
 */

// whether is mount or update, initialed by true
let isMount = true;
// an outer virable to perform hooks one by one
let workInProgressHook;
// fiber for App Component
const fiber = {
    // hooks in linked list, no circle, first node points to first hook
    memorizedState: null,
    stateNode: App
}

function schedule() {
    // get the first hook from fiber and give it to workInProgressHook
    workInProgressHook = fiber.memorizedState;
    // render the component 
    const app = fiber.stateNode();
    // change isMount to false after the first render
    isMount = false;
    return app;
}

// in dispatchAction, we add user update to hook.queue
function dispatchAction(queue, action) {
    const update = {
        action,
        next: null
    };
    if (queue.pending) {
        // if update queue like this, there are at most two nodes in the queue, the first and last
        // which will cause problem when batch update
        update.next = queue.pending.next;
        queue.pending.next = update;
    } else {
        update.next = update;
    }
    queue.pending = update;

    // rerender component after state update
    schedule();
}

function useState(initialState) {
    let hook;
    // first, we need to get hook, so we can get update queue and do the actual update
    if (isMount) {
        // first time, we create hook
        hook = {
            queue: {
                pending: null
            },
            memorizedState: initialState,
            next: null
        };
        // add hook to fiber
        if (!fiber.memorizedState) {
            fiber.memorizedState = hook;
        } else {
            // this means to add hook to fiber.memorizedState.next
            // why use workInProgressHook instead of fiber.memorizedState? like this, fiber.memorizedState.next = hook;
            // because fiber.memorizedState always points to the first hook, while workInProgressHook points to last hook
            // if there are more than 2 hooks, fiber.memorizedState will fail
            workInProgressHook.next = hook;
        }
        // move workInProgressHook, points to the new created hook;
        workInProgressHook = hook;
    } else {
        // when isMount is false, hook already exists, we can give it from workInProgressHook
        hook = workInProgressHook;
        // and we move on to the next ny updating workInProgressHook
        workInProgressHook = workInProgressHook.next;
    }
    // why `workInProgressHook = workInProgressHook.next` do not exist when isMout
    // because `workInProgressHook.next = hook` and `workInProgressHook = hook;` do the move on job

    // second, we do the actual update
    let baseState = hook.memorizedState; // our job is to updateState, so baseState is needed
    if (hook.queue.pending) {
        // do the update
        // hook.queue.pending is a circle linked list, while hook.queue.pending points the latest update, so we use `.next` to get firstUpdate
        let firstUpdate = hook.queue.pending.next; 
        do {
            const action = firstUpdate.action;
            baseState = action(baseState); //update baseState
            firstUpdate = firstUpdate.next;
        } while(firstUpdate !== hook.queue.pending.next);

        hook.queue.pending = null; // clear update queue when finish update
    }
    // update memorizedState for next update
    hook.memorizedState = baseState;

    return [baseState, dispatchAction.bind(null, hook.queue)];
}

function App() {
    const [num, updateNum] = useState(0);
    const [num1, updateNum1] = useState(100);

    console.log(`${isMount ? 'mount' : 'update'} num: `, num);
    console.log(`${isMount ? 'mount' : 'update'} num: `, num1);
    return {
        click() {
            updateNum(num => num + 1);
            updateNum(num => num + 2);
            updateNum(num => num + 3);
        },
        click1() {
            updateNum1(num => num + 3);
        }
    }
}

const appInstance = schedule();
appInstance.click();