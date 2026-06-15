const TomatoView = {
    template: `
        <div style="height: 100%; width: 100%; background: var(--bg-color); overflow-y: auto; padding: 20px 16px; box-sizing: border-box; padding-bottom: 120px;">
            
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://raw.githubusercontent.com/meowoccino/MikoTok/main/a_2.png" style="width: 110px; height: 110px; border-radius: 50%; margin-bottom: 12px; object-fit: cover;" alt="Avatar">
                <h2 style="margin:0; color: var(--text-main);">tomato_24</h2>
                <div style="color:var(--text-muted); font-size:14px; margin-top:4px;">App Developer & Animal Rescuer</div>
            </div>
            
            <div style="color: var(--text-main); font-size: 14px; line-height: 1.6; background: var(--card-bg); padding: 16px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border-color);">
                <div style="text-align: center; margin-bottom: 12px;"><strong style="color:var(--text-main);">Code, AI & Animal Fostering</strong></div>
                Hi there! I'm the solo developer behind MikoTok. If you hang around the CodeMiko Discord, you probably also know me as the person constantly dropping funny AI-generated images and videos in the chat!<br><br>
                If you are enjoying the app and want to support my work, I would be incredibly grateful. Any contributions go directly toward covering the expensive API token costs required to keep Gerald's AI brain running smoothly, funding future app updates, and—most importantly—supporting my animal rescue efforts.<br><br>
                I currently care for a small army of felines (4 indoor, 3 outdoor) plus various neighborhood strays, so every bit helps keep the app servers online and the food bowls fully stocked 🐾
            </div>

            <div style="font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 28px 0 10px 8px;">Support Links</div>
            
            <a href="https://www.paypal.me/meowoccino" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); text-decoration: none; margin-bottom: 8px; border: 1px solid var(--border-color);">
                <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #00457C;"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/><path d="M11.603 13.33H9.412c-.524 0-.968.382-1.05.9l-1.12 7.106-.11.696a.641.641 0 0 0 .633.74h3.693c.48 0 .89-.35.967-.825l.024-.13.717-4.54.04-.21a.987.987 0 0 1 .974-.834h.16c3.606 0 6.425-1.468 7.25-5.698.24-1.226.17-2.39-.234-3.418-1.01 2.92-3.613 4.218-7.747 4.218z" fill="#0079C1"/></svg>
                <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">PayPal</span>
                <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
            </a>

            <a href="https://throne.com/tomato_24" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); text-decoration: none; margin-bottom: 8px; border: 1px solid var(--border-color);">
                <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #ef4444;"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-.84-3-2-3-1.22 0-2.42 1.55-3 2.52-.58-.97-1.78-2.52-3-2.52-1.16 0-2 1.34-2 3 0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 16H4V8h16v11z"/></svg>
                <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Throne</span>
                <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
            </a>

            <a href="https://revolut.me/tomato24" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); text-decoration: none; margin-bottom: 24px; border: 1px solid var(--border-color);">
                <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: var(--text-main);"><path fill="currentColor" d="M14.71 10.533c1.36-.838 2.158-2.257 2.158-3.85C16.868 3.868 14.547 1.547 11.73 1.547H5v17.436h4.37v-5.474h2.81l3.76 5.474h5.226l-4.407-6.126c-.57-.34-.912-.616-1.472-.832l-.58-.492zm-5.46-4.488h1.79c1.05 0 1.905.856 1.905 1.905 0 1.05-.856 1.906-1.906 1.906H9.25V6.045z"/></svg>
                <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Revolut</span>
                <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
            </a>
        </div>
    `
};
