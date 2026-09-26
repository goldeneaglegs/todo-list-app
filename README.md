# To-Do List App 📝

A simple, fast, and beautiful to-do list web application with local storage persistence.

## Features ✨

- ✅ **Add tasks** - Quickly add new tasks to your list
- ✅ **Mark complete** - Check off completed tasks
- ✅ **Delete tasks** - Remove tasks you don't need anymore
- ✅ **Filter tasks** - View all, active, or completed tasks
- ✅ **Clear completed** - Bulk remove all completed items
- ✅ **Local storage** - Your tasks persist across browser sessions
- ✅ **Responsive design** - Works great on mobile and desktop
- ✅ **No backend required** - Runs entirely in your browser

## How to Use 🚀

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/goldeneaglegs/todo-list-app.git
   cd todo-list-app
   ```

2. **Open with a local server:**
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Python 2
   python -m SimpleHTTPServer 8000

   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

3. **Open in your browser:**
   Navigate to `http://localhost:8000`

### Direct Opening
You can also simply double-click `index.html` to open it directly in your browser (though local storage works better with a server).

## Project Structure 📂

```
todo-list-app/
├── index.html      # HTML markup
├── styles.css      # Styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Technologies Used 🛠️

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No dependencies
- **Browser localStorage API** - Data persistence

## Features Explained 📖

### Local Storage
All your tasks are automatically saved to your browser's local storage. Even if you close the browser and come back later, your tasks will still be there.

### Task Filtering
- **All** - See all tasks
- **Active** - See only incomplete tasks
- **Completed** - See only finished tasks

### Task Counter
The app shows you how many active tasks you have left to complete.

## Browser Support 🌐

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Future Improvements 🎯

- [ ] Edit existing tasks
- [ ] Drag and drop to reorder
- [ ] Dark mode
- [ ] Due dates and reminders
- [ ] Task priorities
- [ ] Categories/tags
- [ ] Export tasks
- [ ] Cloud sync

## Contributing 🤝

Feel free to fork this project and submit pull requests for any improvements!

## License 📄

MIT License - feel free to use this project however you like.

## Tips & Tricks 💡

1. **Keyboard shortcuts** - Press Enter to add tasks quickly
2. **Long task names** - Automatically wraps and handles long text
3. **Data safety** - Your data stays in your browser (no server)
4. **Multiple devices** - Each device/browser keeps its own task list

---

**Made with ❤️ by [goldeneaglegs](https://github.com/goldeneaglegs)**