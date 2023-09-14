---
id: 5
title: 'Development Workflow'
description: 'My Development Workflow'
pubDate: 'Sep 08 2023'
heroImage: '/blog-placeholder-3.jpg'
author: 'Nick Moore'
publish: true
---
```bash
fr() {
  IFS=" "
  if [ $# -eq 0 ]; then
    # If no argument provided, prompt the user for a search query
    read -p "Search for: " query
  else
    # Use the provided argument as the search query
    query="$1"
  fi

  # Get the selected file
  # Get the file and line number
  selected_file="$(rg --line-number \
    --with-filename \
    --field-match-separator ' ' \
    --color=always "$query" \
    | fzf --ansi \
    -d ' ' \
    --preview "bat --style=numbers --color=always --highlight-line {2} {1}" \
    --preview-window=right:'50%' --with-nth 1,2 --exact \
    )"

  read -r file_name line_number content <<< "$selected_file"
  unset IFS

  if [ -n "$file_name" ] && [ -n "$line_number" ]; then
    # Open the selected file in neovim with the specified line number
    nvim "$file_name" +"$line_number"
  else
    echo "No file selected."
  fi
}
```
