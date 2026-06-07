        // ═══════════════════════════════════════════════════════════
        //  高达SEED.html — App Logic Layer (已拆分自 data.js)
        //  仅含：UI函数、渲染、交互、弹幕、收藏、动画
        //  数据层见上方 data.js
        // ═══════════════════════════════════════════════════════════
        // ── 图片优化助手：WebP 优先，jpg/png 兜底 ──
        // 所有 assets 图片均已生成同名 .webp 兄弟文件（见 README）。
        // 动态卡片用 webp src + onerror 链式回退到原图，再回退到默认图。
        function webpSrc(path) {
            return path ? path.replace(/\.(jpe?g|png)$/i, '.webp') : path;
        }
        // 内联 onerror 字符串：webp 失败 → 原图；原图失败 → 默认图（defaultJpg 传 null 则隐藏）
        function imgFallback(jpgPath, defaultJpg) {
            const hasDefault = defaultJpg !== null && defaultJpg !== undefined;
            const def = hasDefault ? (defaultJpg || 'assets/gundam/strike-gundam.jpg') : '';
            const second = hasDefault
                ? `this.onerror=null;this.src='${def}';`
                : `this.onerror=null;this.style.display='none';`;
            return `data-jpg="${jpgPath}" onerror="if(this.src.indexOf('.webp')>-1){this.src=this.dataset.jpg;}else{${second}}"`;
        }

        // [已移除重复声明 const characters —— 改用 data.js 提供的同名全局变量]

        // ==================== 完整高达数据档案 (用于详情弹窗 + 未来搜索/筛选)
        // 重要：所有高达设计、型号编号、驾驶员、核心描述均严格基于官方《机动战士高达SEED》及《SEED Destiny》动画进行二次审查，确保真实性。
        // 2026-06 图片/视频/路径全面修复至assets/；Biological CPU（Shani/Clotho/Orga vs Sting/Auel/Stella）分代与机体归属已修正为动漫原型；新增Raider/Calamy/ZAKU Warrior等；3min生长队列只添加纯SEED一致条目。
        // ====================
        // [已移除重复声明 const gundamsData —— 改用 data.js 提供的同名全局变量]

        // Use data from external data.js (loaded above)
        window.gundamsData = window.GUNDAM_DATA?.gundamsData || gundamsData;
        window.characters = window.GUNDAM_DATA?.characters || characters;

        // ==================== 纯SEED动漫原型 档案自动生长队列 (每3分钟添加1机体 + 1人物 · 严格基于官方动画) ====================
        // 所有待添加条目均经过二次审查，确保与《机动战士高达SEED》/《SEED Destiny》TV动画内容一致
        // [已移除重复声明 const pendingCharacters —— 改用 data.js 提供的同名全局变量]

        // [已移除重复声明 const pendingGundams —— 改用 data.js 提供的同名全局变量]

        let archiveGrowthInterval = null;

        // 启动时将旧注释清理，启用3分钟纯SEED生长
        function appendNewCharacterCardSmoothly(char) {
            const grid = document.getElementById('character-grid');
            if (!grid) return;

            const card = document.createElement('div');
            card.className = 'character-card bg-[#111] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-[#C5A26E] transition-all new-declassified';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.96)';

            const placeholderHTML = `<div class="w-28 md:w-32 aspect-[4/5] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 relative bg-gradient-to-br from-[#C5A26E]/10 to-black flex flex-col items-center justify-start pt-5 text-center p-1"><div class="archive-ember"></div><div class="text-[52px] leading-none font-bold text-[#C5A26E]/75 mb-0.5">${(char.name || '??').split('·').pop().slice(0,1)}</div><div class="text-[8px] text-[#C5A26E]/50 tracking-widest leading-none mt-1">ARCHIVE<br>IMAGE</div></div>`;

            const imgHTML = char.image 
                ? `<div class="char-portrait-frame w-28 md:w-32 aspect-[4/5] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 relative"><img src="${webpSrc(char.image)}" loading="lazy" decoding="async" width="128" height="160" class="w-full h-full object-cover" style="object-position: center 18%;" alt="${char.name}" ${imgFallback(char.image, null)}><div class="archive-ember"></div></div>`
                : placeholderHTML;

            card.innerHTML = `
                <div class="flex gap-5 p-5">
                    ${imgHTML}
                    <div class="flex-1 min-w-0">
                        <div class="text-[#C5A26E] text-xs tracking-widest mb-1">${char.faction}</div>
                        <div class="text-2xl font-semibold tracking-tight leading-tight">${char.name}</div>
                        <div class="text-sm text-white/60 mt-1">驾驶机体：${char.pilot}</div>
                        <div class="mt-3 text-sm text-white/75 line-clamp-3">${char.intro}</div>
                    </div>
                </div>
            `;

            card.onclick = () => showCharacterDetail(char);
            grid.appendChild(card);

            // Enhanced Nolan cinematic declassification entrance (film burn + poetry)
            if (window.gsap) {
                // Brief film burn / light leak overlay
                const burn = document.createElement('div');
                burn.className = 'absolute inset-0 bg-gradient-to-tr from-[#C5A26E] via-white to-transparent opacity-0 pointer-events-none';
                burn.style.mixBlendMode = 'screen';
                const frame = card.querySelector('.char-portrait-frame') || card;
                frame.style.position = 'relative';
                frame.appendChild(burn);

                gsap.timeline()
                    .to(burn, { opacity: 0.35, duration: 0.12, ease: "power1.out" })
                    .to(burn, { opacity: 0, duration: 0.9, ease: "power2.in" }, 0.1)
                    .to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.9,
                        ease: "power2.out"
                    }, 0)
                    .to(card, {
                        scale: 0.985,
                        duration: 0.18,
                        ease: "power1.in"
                    })
                    .to(card, {
                        scale: 1,
                        duration: 0.55,
                        ease: "back.out(1.6)"
                    })
                    .add(() => {
                        card.classList.remove('new-declassified');
                        burn.remove();

                        // One-time "DECLASSIFIED" stamp on new character card (cinematic delight)
                        const stamp = document.createElement('div');
                        stamp.className = 'declassified-stamp';
                        stamp.textContent = 'DECLASSIFIED';
                        const target = card.querySelector('.char-portrait-frame') || card;
                        target.style.position = 'relative';
                        target.appendChild(stamp);

                        if (window.gsap) {
                            const randRot = 6 + Math.random() * 4; // organic paper feel
                            gsap.fromTo(stamp, { opacity: 0, scale: 0.5, rotate: randRot - 8 }, 
                                { opacity: 0.85, scale: 1.05, rotate: randRot + 6, duration: 0.45, ease: "back.out(1.7)" });
                            gsap.to(stamp, { scale: 1, duration: 0.25, delay: 0.45, ease: "power2.out" });
                            setTimeout(() => {
                                if (stamp && window.gsap) gsap.to(stamp, { opacity: 0, duration: 1.0, onComplete: () => stamp.remove() });
                                else if (stamp) stamp.remove();
                            }, 2100);
                        }

                        // Subtle classified seal pulse
                        const portraitFrame = card.querySelector('.char-portrait-frame');
                        if (portraitFrame) {
                            portraitFrame.style.boxShadow = '0 0 0 1px rgba(197,162,110,0.45)';
                            setTimeout(() => { if (portraitFrame) portraitFrame.style.boxShadow = ''; }, 1600);
                        }
                    });
            } else {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'none';
            }
        }

        function appendNewGundamCardSmoothly(data) {
            const grid = document.getElementById('gundam-grid');
            if (!grid) return;

            const isNew = true; // treat growth additions as special
            const card = document.createElement('div');
            card.className = 'gundam-card rounded-3xl overflow-hidden border border-white/10 bg-[#111] new-declassified';
            card.setAttribute('data-gundam-id', data.id);
            card.style.opacity = '0';
            card.style.transform = 'translateY(25px)';

            const imgHTML = data.image 
                ? `<div class="h-80 bg-zinc-900 relative overflow-hidden"><img src="${webpSrc(data.image)}" class="w-full h-full object-cover" loading="lazy" decoding="async" width="320" height="320" alt="${data.nameCn}" ${imgFallback(data.image)}><div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div></div>`
                : `<div class="h-80 bg-gradient-to-br from-[#C5A26E]/10 to-black flex items-center justify-center"><div class="text-center"><div class="text-6xl text-[#C5A26E]/60">${data.nameCn?.[0] || '?'}</div></div></div>`;

            card.innerHTML = `
                <div class="relative">
                    ${imgHTML}
                    ${isNew ? `<div class="new-badge absolute top-3 right-3 px-2.5 py-0.5 text-[10px] bg-[#C5A26E] text-black rounded font-semibold tracking-wider">NEW</div>` : ''}
                    <div class="p-4">
                        <div class="flex items-baseline justify-between">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[2px]">${data.model || ''}</div>
                                <div class="font-semibold text-xl tracking-tight">${data.nameCn}</div>
                            </div>
                            <div class="text-right text-xs text-white/60">${data.faction}</div>
                        </div>
                        <div class="text-sm text-white/70 mt-1 line-clamp-2">${data.intro}</div>
                    </div>
                </div>
            `;

            card.onclick = () => showGundamDetail(data.id);
            grid.appendChild(card);

            if (window.gsap) {
                // Matching cinematic film burn for new Gundams
                const burn = document.createElement('div');
                burn.className = 'absolute inset-0 bg-gradient-to-tr from-[#C5A26E] via-white to-transparent opacity-0 pointer-events-none';
                burn.style.mixBlendMode = 'screen';
                card.style.position = 'relative';
                card.appendChild(burn);

                gsap.timeline()
                    .to(burn, { opacity: 0.28, duration: 0.1 })
                    .to(burn, { opacity: 0, duration: 0.85, ease: "power2.in" }, 0.08)
                    .to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0)
                    .to(card, { scale: 0.985, duration: 0.16, ease: "power1.in" })
                    .to(card, { scale: 1, duration: 0.5, ease: "back.out(1.5)" })
                    .add(() => {
                        card.classList.remove('new-declassified');
                        burn.remove();

                        // One-time "DECLASSIFIED" stamp on new Gundam card (cinematic delight)
                        const stamp = document.createElement('div');
                        stamp.className = 'declassified-stamp';
                        stamp.textContent = 'DECLASSIFIED';
                        card.style.position = 'relative';
                        card.appendChild(stamp);

                        if (window.gsap) {
                            const randRot = -6 - Math.random() * 4;
                            gsap.fromTo(stamp, { opacity: 0, scale: 0.5, rotate: randRot + 8 }, 
                                { opacity: 0.85, scale: 1.05, rotate: randRot - 6, duration: 0.45, ease: "back.out(1.7)" });
                            gsap.to(stamp, { scale: 1, duration: 0.25, delay: 0.45, ease: "power2.out" });
                            setTimeout(() => {
                                if (stamp && window.gsap) gsap.to(stamp, { opacity: 0, duration: 1.0, onComplete: () => stamp.remove() });
                                else if (stamp) stamp.remove();
                            }, 2000);
                        }

                        // Auto-fade the NEW badge after ~12s for cleanliness
                        const badge = card.querySelector('.new-badge');
                        if (badge) {
                            setTimeout(() => {
                                if (badge && window.gsap) {
                                    gsap.to(badge, { opacity: 0, duration: 0.8, onComplete: () => badge.remove() });
                                } else if (badge) {
                                    badge.remove();
                                }
                            }, 11800);
                        }
                    });
            } else {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'none';
            }
        }

        function startArchiveGrowth() {
            if (archiveGrowthInterval) return;

            // 每3分钟添加 1个高达机体 + 1个人物（纯SEED动漫原型队列）
            // 所有添加内容严格检查与官方《SEED》/《SEED Destiny》一致，不一致的已在数据层修正为原型
            archiveGrowthInterval = setInterval(() => {
                try {
                    let addedSomething = false;

                    // 优先添加人物（如果队列还有）
                    if (pendingCharacters.length > 0) {
                        const charData = pendingCharacters.shift();
                        characters.push(charData);
                        appendNewCharacterCardSmoothly(charData);
                        showNewArchiveEntryToast({ type: 'character', data: charData });
                        addedSomething = true;

                        // Fate resonance: 联动相关高达卡片高亮
                        setTimeout(() => {
                            const pilotName = charData.pilot || '';
                            const charName = charData.name || '';
                            const possibleIds = Object.keys(gundamsData).filter(k => {
                                const g = gundamsData[k];
                                if (!g) return false;
                                return g.pilot && (g.pilot.includes(pilotName.split('(')[0].trim()) || pilotName.includes(g.nameCn || '') || pilotName.includes(g.name || '') || charName.includes(g.pilot || ''));
                            });
                            possibleIds.forEach((gid, i) => {
                                const gCard = document.querySelector(`.gundam-card[data-gundam-id="${gid}"]`);
                                if (gCard) {
                                    gsap.to(gCard, {
                                        boxShadow: '0 0 0 2px rgba(197,162,110,0.6), 0 0 18px rgba(197,162,110,0.25)',
                                        duration: 0.35,
                                        delay: i * 0.08,
                                        onComplete: () => {
                                            gsap.to(gCard, {
                                                boxShadow: '0 30px 70px -15px rgb(0 0 0 / 0.55)',
                                                duration: 1.6,
                                                ease: "power2.out"
                                            });
                                        }
                                    });
                                }
                            });
                        }, 800);
                    }

                    // 同步添加一个高达机体（如果队列还有）
                    if (pendingGundams.length > 0) {
                        const gData = pendingGundams.shift();
                        gundamsData[gData.id] = gData;
                        appendNewGundamCardSmoothly(gData);
                        showNewArchiveEntryToast({ type: 'gundam', data: gData });
                        addedSomething = true;

                        // 刷新过滤器以包含新机体
                        if (typeof window.filterGundams === 'function') {
                            setTimeout(window.filterGundams, 80);
                        }
                        // 更新总数
                        const countEl = document.getElementById('gundam-count');
                        if (countEl) countEl.textContent = Object.keys(gundamsData).length;
                    }

                    if (!addedSomething) {
                        // 队列耗尽，停止生长并提示完成
                        clearInterval(archiveGrowthInterval);
                        archiveGrowthInterval = null;
                        if (typeof showArchiveCompleteToast === 'function') {
                            setTimeout(showArchiveCompleteToast, 600);
                        }
                        return;
                    }

                    // 轻量级Nolan式电影氛围反馈（每添加时触发）
                    const mainContent = document.querySelector('main') || document.body;
                    if (window.gsap && mainContent) {
                        let grain = document.getElementById('growth-grain');
                        if (!grain) {
                            grain = document.createElement('div');
                            grain.id = 'growth-grain';
                            grain.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:3px 3px;mix-blend-mode:screen;';
                            document.body.appendChild(grain);
                        }
                        gsap.to(grain, { opacity: 0.55, duration: 0.2 });
                        gsap.to(mainContent, {
                            filter: 'contrast(0.95) saturate(0.92)',
                            duration: 0.4,
                            onComplete: () => {
                                gsap.to(grain, { opacity: 0, duration: 1.1, onComplete: () => grain.remove() });
                                gsap.to(mainContent, { filter: 'none', duration: 1.6, ease: "power2.out" });
                            }
                        });
                    }

                    // 命运旁白轻微响应新条目
                    setTimeout(() => {
                        const teaser = document.getElementById('fate-teaser');
                        if (teaser) {
                            const lastAdded = (pendingCharacters.length + pendingGundams.length) > 0 ? '档案继续展开...' : '更多命运已解锁';
                            const orig = teaser.innerHTML;
                            gsap.to(teaser, { opacity: 0.2, duration: 0.15, onComplete: () => {
                                teaser.innerHTML = `<i class="fa-solid fa-film text-[9px]"></i> ${lastAdded}`;
                                gsap.to(teaser, { opacity: 1, duration: 0.4 });
                                setTimeout(() => { if (teaser) teaser.innerHTML = orig; }, 2200);
                            }});
                        }
                    }, 1200);

                } catch (err) {
                    console.error('[SEED Archive] 3min生长遇到可恢复错误:', err);
                }
            }, 3 * 60 * 1000); // 严格每3分钟 (180000ms)
        }

        function showNewArchiveEntryToast(addition) {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#111] border border-[#C5A26E]/60 text-sm rounded-2xl z-[400] flex items-center gap-3 shadow-2xl';
            
            const label = addition.type === 'character' ? '新人物解密' : '新机体解密';
            const name = addition.type === 'character' ? addition.data.name : addition.data.nameCn;

            toast.innerHTML = `
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-file-medical text-[#C5A26E]"></i>
                    <div>
                        <span class="text-[#C5A26E] text-xs tracking-[2px]">${label}</span><br>
                        <span class="font-medium">${name}</span>
                    </div>
                </div>
            `;
            document.body.appendChild(toast);

            // Subtle whole-page Nolan film atmosphere pulse on new declassification
            const main = document.querySelector('main') || document.body;
            if (window.gsap && main) {
                gsap.to(main, { 
                    filter: 'contrast(1.03) saturate(0.96)', 
                    duration: 0.6, 
                    onComplete: () => gsap.to(main, { filter: 'none', duration: 1.8, ease: "power2.out" }) 
                });
            }

            if (window.gsap) {
                gsap.fromTo(toast, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
                setTimeout(() => {
                    if (toast && window.gsap) {
                        gsap.to(toast, { opacity: 0, y: -10, duration: 0.6, onComplete: () => toast.remove() });
                    } else if (toast) {
                        toast.remove();
                    }
                }, 4200);
            } else {
                setTimeout(() => toast.remove(), 4500);
            }
        }

        function showArchiveCompleteToast() {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#111] border border-[#C5A26E] text-sm rounded-3xl z-[400] shadow-2xl text-center';
            toast.innerHTML = `
                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-1">ARCHIVE COMPLETE</div>
                <div class="font-semibold">机动战士高达SEED 主要档案已完全解密</div>
                <div class="text-xs text-white/50 mt-1">所有重要人物与机体已收录于命运褶皱之中</div>
            `;
            document.body.appendChild(toast);

            if (window.gsap) {
                gsap.fromTo(toast, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.2)" });
                setTimeout(() => {
                    if (toast && window.gsap) gsap.to(toast, { opacity: 0, duration: 1.2, onComplete: () => toast.remove() });
                    else if (toast) toast.remove();
                }, 6500);
            } else {
                setTimeout(() => toast.remove(), 7000);
            }
        }

        // ==================== 动态渲染高达网格 (从 gundamsData 生成 - 大幅减少 HTML 体积) ====================
        function renderGundams(sortMode = 'default') {
            const grid = document.getElementById('gundam-grid');
            if (!grid) return;

            // 动态更新历代高达总数
            const countEl = document.getElementById('gundam-count');
            if (countEl) {
                countEl.textContent = Object.keys(gundamsData).length;
            }
            
            // 先同步清空，再追加卡片（修复：原 onComplete 延迟回调会把刚追加的卡片删光导致网格为空）
            while (grid.firstChild) grid.removeChild(grid.firstChild);
            if (window.gsap) {
                gsap.fromTo(grid, { opacity: 0.6 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
            }

            let entries = Object.values(gundamsData);

            // 排序逻辑
            if (sortMode === 'name') {
                entries.sort((a, b) => (a.nameCn || '').localeCompare(b.nameCn || ''));
            } else if (sortMode === 'pilot') {
                entries.sort((a, b) => (a.pilot || '').localeCompare(b.pilot || ''));
            } else if (sortMode === 'model') {
                entries.sort((a, b) => (a.model || '').localeCompare(b.model || ''));
            }

            const newIds = ['duel', 'buster', 'blitz'];
            const fragment = document.createDocumentFragment();

            entries.forEach(data => {
                const isNew = newIds.includes(data.id);

                const card = document.createElement('div');
                card.className = 'gundam-card rounded-3xl overflow-hidden border border-white/10 bg-[#111]';
                card.setAttribute('data-gundam-id', data.id);
                
                // Build inner structure efficiently (no template string per item)
                const imgContainer = document.createElement('div');
                imgContainer.className = 'h-80 bg-zinc-900 relative';
                
                const img = document.createElement('img');
                img.loading = 'lazy';
                img.decoding = 'async';
                img.width = 320;
                img.height = 320;
                img.src = webpSrc(data.image);
                img.dataset.jpg = data.image;
                img.onerror = function() {
                    if (this.src.indexOf('.webp') > -1) { this.src = this.dataset.jpg; }
                    else { this.onerror = null; this.src = 'assets/gundam/strike-gundam.jpg'; }
                };
                img.className = 'w-full h-full object-cover ms-image';
                img.alt = data.nameCn ? `${data.nameCn} ${data.name || ''}`.trim() : (data.name || '机动战士');
                imgContainer.appendChild(img);
                
                const modelBadge = document.createElement('div');
                modelBadge.className = 'absolute top-4 right-4 px-3 py-1 text-xs bg-black/70 rounded-full tracking-widest';
                modelBadge.textContent = data.model;
                imgContainer.appendChild(modelBadge);
                
                if (isNew) {
                    const newBadge = document.createElement('div');
                    newBadge.className = 'absolute top-4 left-4 px-2.5 py-0.5 text-[10px] bg-[#C5A26E] text-black font-bold tracking-widest rounded NEW-badge';
                    newBadge.textContent = 'NEW';
                    imgContainer.appendChild(newBadge);
                }
                
                const info = document.createElement('div');
                info.className = 'p-6';
                info.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-semibold text-2xl tracking-tight">${data.name}</div>
                            <div class="text-sm text-[#C5A26E]">${data.nameCn}</div>
                        </div>
                        <div class="text-right text-xs">
                            <div class="text-white/40">驾驶员</div>
                            <div class="font-medium">${data.pilot}</div>
                        </div>
                    </div>
                    <div class="mt-4 text-sm text-white/60">${data.intro}</div>
                `;
                
                card.appendChild(imgContainer);
                card.appendChild(info);
                fragment.appendChild(card);
            });

            grid.appendChild(fragment);

            // GSAP cinematic entrance - optimized stagger for delight & smoothness (Nolan tension build)
            if (window.gsap && grid.children.length > 0) {
                gsap.to(grid, { opacity: 1, duration: 0.12 }); // restore from time-shift

                // Subtle Nolan "time distortion" flash on re-render for premium archive feel
                gsap.fromTo(grid, 
                    { filter: "contrast(0.7) saturate(0.6)" },
                    { filter: "none", duration: 0.65, ease: "power2.out" }
                );

                gsap.fromTo(grid.children, 
                    { opacity: 0, y: 26, scale: 0.985 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.52, 
                        stagger: { amount: 0.42, from: "start", ease: "power2.out" }, 
                        ease: "power2.out", 
                        delay: 0.04,
                        clearProps: "opacity,transform,filter"
                    }
                );
            }
        }

        function renderCharacters() {
            const grid = document.getElementById('character-grid');
            grid.innerHTML = '';

            characters.forEach(char => {
                const card = document.createElement('div');
                card.className = 'character-card bg-[#111] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-[#C5A26E] transition-all';
                
                const portraitFrameClass = 'char-portrait-frame w-28 md:w-32 aspect-[4/5] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 relative';
                const placeholderHTML = `<div class="${portraitFrameClass} bg-gradient-to-br from-[#C5A26E]/10 to-black flex flex-col items-center justify-start pt-5 text-center p-1"><div class="archive-ember"></div><div class="text-[52px] leading-none font-bold text-[#C5A26E]/75 mb-0.5">${(char.name || '??').split('·').pop().slice(0,1)}</div><div class="text-[8px] text-[#C5A26E]/50 tracking-widest leading-none mt-1">ARCHIVE<br>IMAGE</div></div>`;
                const imgHTML = char.image 
                    ? `<div class="${portraitFrameClass}" data-fallback="${placeholderHTML.replace(/"/g, '&quot;')}"><img src="${webpSrc(char.image)}" data-jpg="${char.image}" class="w-full h-full object-cover" loading="lazy" decoding="async" width="128" height="160" style="object-position: center 18%;" alt="${char.name}" onerror="if(this.src.indexOf('.webp')>-1){this.src=this.dataset.jpg;}else{const fb=this.parentElement.dataset.fallback; if(fb){this.parentElement.innerHTML=fb;}else{this.style.display='none';}}"><div class="archive-ember"></div></div>`
                    : placeholderHTML;

                card.innerHTML = `
                    <div class="flex gap-5 p-5">
                        ${imgHTML}
                        <div class="flex-1 min-w-0">
                            <div class="text-[#C5A26E] text-xs tracking-widest mb-1">${char.faction}</div>
                            <div class="text-2xl font-semibold tracking-tight leading-tight">${char.name}</div>
                            <div class="text-sm text-white/60 mt-1">驾驶机体：${char.pilot}</div>
                            
                            <div class="mt-3 text-sm text-white/75 line-clamp-3">${char.intro}</div>
                        </div>
                    </div>
                `;
                card.onclick = () => showCharacterDetail(char);

                // Delightful "declassified" micro-reveal for the 6 new real portraits (cinematic smoothness)
                if (char.image) {
                    const imgEl = card.querySelector('img');
                    if (imgEl) {
                        imgEl.addEventListener('load', () => {
                            const ember = card.querySelector('.archive-ember');
                            if (ember) {
                                card.classList.add('revealed');
                                // One-time soft golden film pulse then settle
                                setTimeout(() => {
                                    if (window.gsap && ember) {
                                        gsap.to(ember, { opacity: 0.25, duration: 1.2, ease: "power2.out" });
                                    }
                                }, 1350);
                            }
                        }, { once: true });
                    }
                }

                grid.appendChild(card);
            });
        }

        function showCharacterDetail(char) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-6';
            
            // 极致优化后的精美肖像布局（桌面双栏 + 完美头像完整展示）
            const modalPlaceholder = `<div class="w-full md:w-2/5 aspect-[3/4] md:aspect-auto md:h-full bg-gradient-to-br from-[#111] via-[#1a1a1a] to-black flex flex-col items-center justify-center text-center p-8 border border-[#C5A26E]/30 relative overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(#C5A26E_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-10"></div><div class="relative z-10"><div class="text-[72px] leading-none font-bold text-[#C5A26E]/80 mb-1 drop-shadow-lg">${(char.name || '??').split('·').pop().slice(0,1)}</div><div class="text-xs tracking-[3px] text-[#C5A26E]/70 mb-4">CLASSIFIED DOSSIER</div><div class="text-[10px] text-[#C5A26E]/50 tracking-widest">PORTRAIT IMAGE<br>TO BE ADDED<br>(BASED ON OFFICIAL ANIME)</div></div><div class="absolute bottom-4 right-4 text-[9px] text-[#C5A26E]/30 tracking-widest">SEED ARCHIVE</div></div>`;
            const imgHTML = char.image 
                ? `
                    <div class="w-full md:w-2/5 flex-shrink-0 relative overflow-hidden md:rounded-l-3xl rounded-t-3xl bg-black/30" data-modal-fallback="${modalPlaceholder.replace(/"/g, '&quot;')}">
                        <img src="${webpSrc(char.image)}" data-jpg="${char.image}"
                             class="w-full h-full object-cover"
                             decoding="async" width="600" height="800"
                             style="aspect-ratio: 3 / 4; object-position: center 18% !important;"
                             alt="${char.name}"
                             onerror="if(this.src.indexOf('.webp')>-1){this.src=this.dataset.jpg;}else{const p=this.closest('[data-modal-fallback]'); if(p){p.innerHTML=p.dataset.modalFallback;}}">
                        <!-- 极致精美肖像装饰边框（Nolan电影质感） -->
                        <div class="absolute inset-0 border border-[#C5A26E]/20 pointer-events-none"></div>
                        <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                    </div>
                ` 
                : modalPlaceholder;

            modal.innerHTML = `
                <div class="bg-[#111] w-full max-w-4xl md:max-w-5xl mx-4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row">
                    <!-- 左侧 / 上方：极致精美完整人物头像 -->
                    ${imgHTML}
                    
                    <!-- 右侧 / 下方：信息区（极致优化排版，文字呼吸感强） -->
                    <div class="flex-1 p-8 md:p-10 flex flex-col">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-1">${char.faction}</div>
                                <div class="text-4xl md:text-5xl font-bold tracking-[-1.5px] leading-none">${char.name}</div>
                            </div>
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="text-4xl leading-none text-white/30 hover:text-white transition mt-1">×</button>
                        </div>
                        
                        <div class="space-y-6 flex-1 overflow-auto pr-1 text-[15px] leading-relaxed">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[2px] mb-1.5">驾驶机体</div>
                                <div class="font-medium text-lg">${char.pilot}</div>
                            </div>
                            
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[2px] mb-1.5">人物介绍</div>
                                <div class="text-white/90">${char.intro}</div>
                            </div>
                            
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[2px] mb-1.5">人物关系</div>
                                <div class="text-white/90">${char.relationship}</div>
                            </div>

                            <!-- 游戏化能力档案（像游戏角色卡） -->
                            ${(char.personality || char.attributes || char.abilityValue) ? `
                            <div class="pt-4 border-t border-white/10">
                                <div class="text-[#C5A26E] text-xs tracking-[2px] mb-3 flex items-center gap-2">
                                    <span>能力档案</span> 
                                    <span class="text-[10px] px-2 py-0.5 bg-[#C5A26E]/10 text-[#C5A26E] rounded">GAME DATA</span>
                                </div>

                                ${char.personality ? `<div class="text-sm mb-3"><span class="text-white/60">性格：</span> <span class="text-white/95">${char.personality}</span></div>` : ''}

                                ${char.attributes ? `
                                <div class="space-y-2 mb-4">
                                    ${Object.entries(char.attributes).map(([key, val]) => `
                                        <div class="flex items-center gap-3 text-xs">
                                            <div class="w-16 text-[#C5A26E]">${key}</div>
                                            <div class="flex-1 bg-white/10 h-1.5 rounded overflow-hidden">
                                                <div class="h-1.5 bg-gradient-to-r from-[#C5A26E] to-white rounded" style="width: ${val}%"></div>
                                            </div>
                                            <div class="w-7 text-right font-mono text-[#C5A26E]">${val}</div>
                                        </div>
                                    `).join('')}
                                </div>` : ''}

                                ${char.specialties && char.specialties.length ? `
                                <div class="mb-3">
                                    <div class="text-[10px] text-emerald-400 mb-1">特长</div>
                                    <div class="flex flex-wrap gap-1">
                                        ${char.specialties.map(s => `<span class="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">${s}</span>`).join('')}
                                    </div>
                                </div>` : ''}

                                ${char.flaws && char.flaws.length ? `
                                <div class="mb-3">
                                    <div class="text-[10px] text-amber-400 mb-1">缺陷</div>
                                    <div class="flex flex-wrap gap-1">
                                        ${char.flaws.map(f => `<span class="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded">${f}</span>`).join('')}
                                    </div>
                                </div>` : ''}

                                ${char.abilityValue ? `
                                <div class="flex items-center justify-between pt-2 border-t border-white/10">
                                    <div>
                                        <span class="text-xs text-white/60">综合能力值</span><br>
                                        <span class="text-4xl font-bold text-[#C5A26E]">${char.abilityValue}</span>
                                    </div>
                                    ${char.recommendation ? `<div class="text-xs px-3 py-1 bg-[#C5A26E]/10 text-[#C5A26E] rounded text-right leading-tight">${char.recommendation}</div>` : ''}
                                </div>` : ''}
                            </div>` : ''}
                        </div>
                        
                        <div class="mt-8 pt-6 border-t border-white/10 text-center text-xs tracking-[3px] text-white/40">
                            GUNDAM SEED ARCHIVE — CLASSIFIED
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 打开后的极致精美微动画（头像优先进入 + 游戏数据条动画 + Nolan dossier opening）
            if (window.gsap) {
                const portrait = modal.querySelector('img');
                const content = modal.querySelector('.flex-1');
                const leftPane = modal.querySelector('.md\\:w-2\\/5') || modal.querySelector('[class*="w-full md:w-2/5"]');

                if (portrait) {
                    gsap.fromTo(portrait, { scale: 1.035, opacity: 0.65 }, { scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" });
                    // Filmic dossier "opening" light leak + grain pulse
                    if (leftPane) {
                        gsap.fromTo(leftPane, 
                            { filter: 'contrast(0.92) saturate(0.85) brightness(0.96)' },
                            { filter: 'none', duration: 1.1, ease: "power2.inOut", delay: 0.08 }
                        );
                    }
                }
                if (content) {
                    gsap.fromTo(content, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.18, ease: "power2.out" });
                }

                // Animate game stat bars for delightful reveal
                const bars = modal.querySelectorAll('.flex-1 .bg-gradient-to-r');
                if (bars.length > 0) {
                    bars.forEach((bar, i) => {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0%';
                        gsap.to(bar, {
                            width: targetWidth,
                            duration: 0.82,
                            delay: 0.62 + (i * 0.055),
                            ease: "power2.out"
                        });
                    });
                }
            }
        }

        // ==================== 女性角色命运之舞 + 实时生成音乐 ====================
        let fateDanceAudio = null;
        let fateDanceOscillators = [];

        function startFateDanceMusic(characterId = 'lacus') {
            if (fateDanceAudio) {
                stopFateDanceMusic();
                // small delay to let previous audio context close
                setTimeout(() => startFateDanceMusic(characterId), 650);
                return;
            }
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                fateDanceAudio = new AudioContext();

                const masterGain = fateDanceAudio.createGain();
                masterGain.gain.value = 0.18;

                const filter = fateDanceAudio.createBiquadFilter();
                filter.type = 'lowpass';

                const delay = fateDanceAudio.createDelay(1.5);
                const delayGain = fateDanceAudio.createGain();

                let profile = {
                    masterGain: 0.16,
                    filterFreq: 920,
                    delayTime: 0.85,
                    delayFeedback: 0.18,
                    baseNotes: [261.63, 392.00, 466.16],
                    oscTypes: ['sine', 'triangle', 'sine'],
                    lfoSpeeds: [0.06, 0.09, 0.04],
                    melodyNotes: [659.25, 783.99, 880.00, 1046.5],
                    melodySpeed: 1950,
                    melodyGain: 0.028
                };

                // Character-specific music that matches their dance personality
                if (characterId === 'lacus') {
                    // Ethereal Peace Sonata — floating, song-like, peaceful, high and dreamy
                    profile = {
                        masterGain: 0.15,
                        filterFreq: 1250,
                        delayTime: 1.1,
                        delayFeedback: 0.22,
                        baseNotes: [329.63, 493.88, 659.25], // E major, brighter
                        oscTypes: ['sine', 'sine', 'triangle'],
                        lfoSpeeds: [0.045, 0.07, 0.035],
                        melodyNotes: [783.99, 880.00, 987.77, 1174.66],
                        melodySpeed: 2100,
                        melodyGain: 0.032
                    };
                } else if (characterId === 'lunamaria') {
                    // Red Destiny Waltz — warm, passionate, rhythmic, driving energy
                    profile = {
                        masterGain: 0.20,
                        filterFreq: 880,
                        delayTime: 0.55,
                        delayFeedback: 0.28,
                        baseNotes: [220.00, 329.63, 440.00], // A minor, richer
                        oscTypes: ['triangle', 'sawtooth', 'sine'],
                        lfoSpeeds: [0.11, 0.14, 0.08],
                        melodyNotes: [659.25, 698.46, 783.99, 880.00],
                        melodySpeed: 1350,
                        melodyGain: 0.04
                    };
                } else if (characterId === 'cagalli') {
                    // Obu Flame Harmony — powerful, determined, intense with tension and release
                    profile = {
                        masterGain: 0.19,
                        filterFreq: 680,
                        delayTime: 0.65,
                        delayFeedback: 0.15,
                        baseNotes: [174.61, 261.63, 349.23], // F minor, darker and strong
                        oscTypes: ['sawtooth', 'triangle', 'sine'],
                        lfoSpeeds: [0.07, 0.13, 0.05],
                        melodyNotes: [523.25, 622.25, 698.46, 783.99],
                        melodySpeed: 1250,
                        melodyGain: 0.045
                    };
                } else if (characterId === 'natarle') {
                    // Classified Elegy — strict, elegant, military poise with underlying melancholy
                    profile = {
                        masterGain: 0.17,
                        filterFreq: 780,
                        delayTime: 0.9,
                        delayFeedback: 0.12,
                        baseNotes: [246.94, 369.99, 493.88],
                        oscTypes: ['sine', 'triangle', 'sine'],
                        lfoSpeeds: [0.055, 0.09, 0.04],
                        melodyNotes: [587.33, 659.25, 739.99, 830.61],
                        melodySpeed: 1750,
                        melodyGain: 0.03
                    };
                } else {
                    // Meyrin — gentle, observant, hidden warmth
                    profile = {
                        masterGain: 0.14,
                        filterFreq: 1100,
                        delayTime: 1.25,
                        delayFeedback: 0.25,
                        baseNotes: [293.66, 440.00, 587.33],
                        oscTypes: ['sine', 'sine', 'triangle'],
                        lfoSpeeds: [0.05, 0.065, 0.038],
                        melodyNotes: [698.46, 783.99, 880.00, 987.77],
                        melodySpeed: 2250,
                        melodyGain: 0.026
                    };
                }

                masterGain.gain.value = profile.masterGain;

                filter.frequency.value = profile.filterFreq;

                delay.delayTime.value = profile.delayTime;
                delayGain.gain.value = profile.delayFeedback;

                // Character-tuned pads
                profile.baseNotes.forEach((freq, i) => {
                    const osc = fateDanceAudio.createOscillator();
                    osc.type = profile.oscTypes[i] || 'sine';
                    osc.frequency.value = freq;

                    const gain = fateDanceAudio.createGain();
                    gain.gain.value = 0.55 - i * 0.1;

                    const lfo = fateDanceAudio.createOscillator();
                    lfo.type = 'sine';
                    lfo.frequency.value = profile.lfoSpeeds[i] || 0.07;

                    const lfoGain = fateDanceAudio.createGain();
                    lfoGain.gain.value = 2.8;

                    lfo.connect(lfoGain);
                    lfoGain.connect(osc.frequency);
                    lfo.start();

                    const oscGain = fateDanceAudio.createGain();
                    oscGain.gain.value = 0.0;
                    osc.connect(oscGain);
                    oscGain.connect(filter);

                    osc.start();
                    fateDanceOscillators.push({ osc, gain: oscGain, lfo });

                    setTimeout(() => {
                        if (oscGain) oscGain.gain.value = 0.20 - i * 0.04;
                    }, 380 + i * 160);
                });

                // Character-specific melody
                setTimeout(() => {
                    if (!fateDanceAudio) return;
                    const melody = profile.melodyNotes;
                    let step = 0;
                    const melodyOsc = fateDanceAudio.createOscillator();
                    melodyOsc.type = (characterId === 'cagalli') ? 'sawtooth' : 'sine';
                    melodyOsc.frequency.value = melody[0];
                    const melodyGainNode = fateDanceAudio.createGain();
                    melodyGainNode.gain.value = profile.melodyGain;
                    melodyOsc.connect(melodyGainNode);
                    melodyGainNode.connect(filter);
                    melodyOsc.start();

                    const melodyInterval = setInterval(() => {
                        if (!fateDanceAudio) { clearInterval(melodyInterval); return; }
                        step = (step + 1) % melody.length;
                        melodyOsc.frequency.setValueAtTime(melody[step], fateDanceAudio.currentTime + 0.03);
                    }, profile.melodySpeed);

                    fateDanceOscillators.push({ osc: melodyOsc, gain: melodyGainNode, interval: melodyInterval });
                }, 1350);

                // Connect delay for rhythmic characters
                if (characterId === 'lunamaria' || characterId === 'cagalli') {
                    const wet = fateDanceAudio.createGain();
                    wet.gain.value = 0.35;
                    filter.connect(delay);
                    delay.connect(delayGain);
                    delayGain.connect(wet);
                    wet.connect(masterGain);
                    filter.connect(masterGain);
                } else {
                    filter.connect(masterGain);
                }

                masterGain.connect(fateDanceAudio.destination);
            } catch (e) {
                console.log('Fate music not supported in this browser');
            }
        }

        function stopFateDanceMusic() {
            if (!fateDanceAudio) return;
            fateDanceOscillators.forEach(item => {
                try {
                    if (item.osc) item.osc.stop();
                    if (item.lfo) item.lfo.stop();
                    if (item.gain) item.gain.gain.value = 0;
                    if (item.interval) clearInterval(item.interval);
                } catch (e) {}
            });
            fateDanceOscillators = [];
            setTimeout(() => {
                if (fateDanceAudio) {
                    fateDanceAudio.close().catch(() => {});
                    fateDanceAudio = null;
                }
            }, 600);
        }

        function openFemaleDanceModal(id) {
            const danceData = {
                'lacus': {
                    name: '拉克丝·克莱因',
                    title: '自由的歌姬',
                    video: 'assets/videos/dance/lacus-dance.mp4',
                    desc: '在命运的静谧中，她以歌声与舞蹈编织和平的祈愿。粉色长发如光之翼般轻舞，每一个转身都诉说着对自由的渴望。',
                    music: 'Ethereal Peace Sonata'
                },
                'lunamaria': {
                    name: '露娜玛丽亚·霍克',
                    title: '红色机上的烈焰',
                    video: 'assets/videos/dance/lunamaria-dance.mp4',
                    desc: '开朗却内心坚定的她，在战场与爱情之间起舞。红色机驾驶员的热烈与温柔，在这支舞蹈中完美融合。',
                    music: 'Red Destiny Waltz'
                },
                'cagalli': {
                    name: '卡嘉莉·尤拉·阿斯哈',
                    title: '奥布的守护火焰',
                    video: 'assets/videos/dance/cagalli-dance.mp4',
                    desc: '直率而充满力量的公主，以坚毅的舞步守护她所爱的一切。她的舞蹈如烈焰，燃烧着对家园与爱人的承诺。',
                    music: 'Obu Flame Harmony'
                },
                'natarle': {
                    name: '娜塔尔·巴达吉露',
                    title: '铁血的军礼',
                    video: 'assets/videos/dance/natarle-dance.mp4',
                    desc: '严格而公正的副舰长，以军人的庄严姿态起舞。每一个动作都带着对职责与情感的克制张力。',
                    music: 'Classified Elegy'
                },
                'meyrin': {
                    name: '梅琳·霍克',
                    title: '隐秘的温柔守护',
                    video: 'assets/videos/dance/meyrin-dance.mp4',
                    desc: '温柔的观察者，在阴影中用细腻的舞姿守护着她所珍视的人。她的舞蹈轻如耳语，却深沉如海。',
                    music: 'Silent Watcher Theme'
                }
            };

            const data = danceData[id] || danceData['lacus'];
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4 md:p-8 dance-modal';

            const hasVideo = data.video && data.video !== '';

            modal.innerHTML = `
                <div class="bg-[#0A0A0A] w-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row max-h-[94vh]">
                    <!-- Video / Visual Area -->
                    <div class="w-full md:w-3/5 relative flex items-center justify-center bg-black dance-video-container" style="min-height: 380px;">
                        ${hasVideo ? `
                            <video id="dance-video" class="w-full h-full object-contain" autoplay loop playsinline>
                                <source src="${data.video}" type="video/mp4">
                            </video>
                            <div class="film-grain-overlay"></div>
                            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 px-2">
                                <button onclick="const v=document.getElementById('dance-video'); v.paused ? v.play() : v.pause(); this.innerHTML = v.paused ? '<i class=\\'fa-solid fa-play\\'></i>' : '<i class=\\'fa-solid fa-pause\\'></i>'" 
                                        class="px-5 py-2 bg-white/90 text-black text-sm rounded-2xl flex items-center gap-2 hover:bg-white transition">
                                    <i class="fa-solid fa-pause"></i> <span class="font-medium">PAUSE / PLAY</span>
                                </button>
                                <div class="text-xs text-white/60 bg-black/50 px-3 py-1 rounded">FATE DANCE ARCHIVE • 8s LOOP</div>
                            </div>
                        ` : `
                            <div class="text-center p-10">
                                <div class="text-6xl text-[#C5A26E]/30 mb-4"><i class="fa-solid fa-video"></i></div>
                                <div class="text-xl text-white/80 mb-2">此角色舞蹈影像正在生成中</div>
                                <div class="text-sm text-white/50">敬请期待更多SEED宇宙命运之舞</div>
                            </div>
                        `}
                        <div class="absolute top-4 left-4 px-4 py-1 bg-black/70 text-xs tracking-[3px] border border-white/20 rounded">CLASSIFIED • FATE DANCE</div>
                    </div>

                    <!-- Info + Music Panel -->
                    <div class="w-full md:w-2/5 p-8 md:p-10 flex flex-col bg-[#111] relative">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-1">GUNDAM SEED • FEMALE ARCHIVE</div>
                                <div class="text-4xl font-bold tracking-tighter leading-none">${data.name}</div>
                                <div class="text-[#C5A26E] mt-1 text-lg">${data.title}</div>
                            </div>
                            <button onclick="this.closest('.fixed').remove(); stopFateDanceMusic()" class="text-4xl leading-none text-white/30 hover:text-white transition">×</button>
                        </div>

                        <div class="mt-8 text-white/85 leading-relaxed text-[15px]">
                            ${data.desc}
                        </div>

                        <div class="mt-auto pt-8 border-t border-white/10">
                            <div class="flex items-center gap-3 mb-3">
                                <i class="fa-solid fa-music text-[#C5A26E]"></i>
                                <div>
                                    <div class="text-xs text-[#C5A26E] tracking-[2px]">FATE SYMPHONY</div>
                                    <div class="font-medium dance-music-label" data-char="${id}">${data.music}</div>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <button onclick="startFateDanceMusic('${id}')" 
                                        class="flex-1 px-6 py-3 bg-[#C5A26E] text-black font-semibold rounded-2xl text-sm hover:bg-[#d4b98a] active:scale-[0.985] transition flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-play"></i> <span>播放命运交响</span>
                                </button>
                                <button onclick="stopFateDanceMusic()" 
                                        class="px-6 py-3 border border-white/30 rounded-2xl text-sm hover:bg-white/5 transition">停止音乐</button>
                            </div>
                            <div class="text-[10px] text-white/40 mt-3 leading-tight">实时生成的SEED宇宙氛围音乐 · 无需外部音频文件</div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Premium Nolan-directed entrance (GSAP cinematic polish)
            if (window.gsap) {
                const videoPane = modal.querySelector('.dance-video-container');
                const infoPane = modal.querySelector('.md\\:w-2\\/5') || modal.querySelector('[class*="w-full md:w-2/5"]');
                
                if (videoPane) {
                    gsap.fromTo(videoPane, 
                        { opacity: 0.6, scale: 1.015, filter: 'contrast(0.85) saturate(0.7)' },
                        { opacity: 1, scale: 1, filter: 'none', duration: 0.9, ease: "power2.out" }
                    );
                }
                if (infoPane) {
                    gsap.fromTo(infoPane, { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.65, delay: 0.25, ease: "power2.out" });
                }
            }

            // Auto start music + video + visual pulse (fate immersion)
            setTimeout(() => {
                const video = modal.querySelector('#dance-video');
                if (video) {
                    video.volume = 0.0;
                    video.play().catch(() => {});

                    // One-time premium "declassified" archive stamp (cinematic delight)
                    setTimeout(() => {
                        const pane = modal.querySelector('.dance-video-container');
                        if (pane && !pane.querySelector('.declassified-stamp')) {
                            const stamp = document.createElement('div');
                            stamp.className = 'declassified-stamp';
                            stamp.textContent = 'DECLASSIFIED';
                            pane.appendChild(stamp);
                            if (window.gsap) {
                                gsap.fromTo(stamp, { opacity: 0, scale: 0.7 }, { opacity: 0.85, scale: 1, duration: 0.6, ease: "back.out(1.4)" });
                                setTimeout(() => {
                                    if (stamp && window.gsap) gsap.to(stamp, { opacity: 0, duration: 1.2, onComplete: () => stamp.remove() });
                                    else if (stamp) stamp.remove();
                                }, 1850);
                            }
                        }
                    }, 420);
                }
                startFateDanceMusic(id);

                // Apply music-reactive vignette pulse for visual poetry (character-specific tempo)
                const videoPane = modal.querySelector('.dance-video-container');
                if (videoPane) {
                    videoPane.classList.add('music-pulse', id);
                }

                // Sync the music label breathing to the same tempo
                const musicLabel = modal.querySelector('.dance-music-label');
                if (musicLabel) {
                    const durations = { lacus: 3600, lunamaria: 2100, cagalli: 1650, natarle: 2900, meyrin: 3200 };
                    const dur = durations[id] || 2800;
                    musicLabel.style.animation = `musicLabelBreath ${dur}ms ease-in-out infinite`;
                }

                // Fate resonance: softly illuminate related Gundam cards in the living archive (Nolan poetry)
                const resonanceMap = {
                    'lacus': ['strike-freedom', 'freedom', 'strike'],
                    'lunamaria': ['destiny-gundam', 'impulse-gundam'],
                    'cagalli': ['strike-rouge', 'justice-gundam']
                };
                const relatedIds = resonanceMap[id] || [];
                if (relatedIds.length > 0) {
                    setTimeout(() => {
                        relatedIds.forEach((gid, idx) => {
                            const card = document.querySelector(`.gundam-card[data-gundam-id="${gid}"]`);
                            if (card && card.style.display !== 'none') {
                                card.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
                                card.style.boxShadow = '0 0 0 2px rgba(197,162,110,0.55), 0 0 25px rgba(197,162,110,0.25)';
                                card.style.borderColor = '#C5A26E';
                                setTimeout(() => {
                                    if (card) {
                                        card.style.boxShadow = '0 30px 70px -15px rgb(0 0 0 / 0.55)';
                                        card.style.borderColor = '';
                                    }
                                }, 2400 + idx * 300);
                            }
                        });
                    }, 950);
                }
            }, 620);

            // Cleanup when modal closes
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    const videoPane = modal.querySelector('.dance-video-container');
                    if (videoPane) videoPane.classList.remove('music-pulse');
                    modal.remove();
                    stopFateDanceMusic();
                }
            });
        }

        // ==================== Canvas Starfield Background ====================
        function initStarfield() {
            const container = document.querySelector('body');
            if (!container) return;

            const canvas = document.createElement('canvas');
            canvas.id = 'starfield-canvas';
            canvas.style.cssText = `
                position: fixed; top: 0; left: 0;
                width: 100%; height: 100%; z-index: 0;
                pointer-events: none; opacity: 0.6;
            `;
            container.style.position = 'relative';
            container.insertBefore(canvas, container.firstChild);

            const ctx = canvas.getContext('2d');
            let stars = [];
            const STAR_COUNT = 80;

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                stars = Array.from({ length: STAR_COUNT }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.5 + 0.3,
                    alpha: Math.random(),
                    alphaDir: Math.random() > 0.5 ? 0.008 : -0.008,
                    speed: Math.random() * 0.15 + 0.05,
                    drift: (Math.random() - 0.5) * 0.1,
                }));
            }
            resize();
            window.addEventListener('resize', resize);

            function drawFrame() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                stars.forEach(s => {
                    s.alpha += s.alphaDir;
                    if (s.alpha >= 1) { s.alpha = 1; s.alphaDir = -Math.abs(s.alphaDir); }
                    if (s.alpha <= 0.05) { s.alpha = 0.05; s.alphaDir = Math.abs(s.alphaDir); }
                    s.y -= s.speed;
                    s.x += s.drift;
                    if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }

                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(197, 162, 110, ${s.alpha})`;
                    ctx.fill();

                    // Glow
                    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
                    grad.addColorStop(0, `rgba(200, 180, 100, ${s.alpha * 0.3})`);
                    grad.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();
                });
                requestAnimationFrame(drawFrame);
            }
            drawFrame();
        }

        // ==================== Blur-up Image Placeholder ====================
        function initBlurUp() {
            document.querySelectorAll('img[data-blurup]').forEach(img => {
                const placeholder = document.createElement('div');
                placeholder.className = 'blur-up-placeholder';
                placeholder.style.cssText = `
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
                    z-index: 1; pointer-events: none;
                `;
                img.parentElement.style.position = 'relative';
                img.parentElement.insertBefore(placeholder, img);
                img.style.position = 'relative';
                img.style.zIndex = '2';
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';

                if (img.complete) {
                    placeholder.style.opacity = '0';
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', () => {
                        placeholder.style.transition = 'opacity 0.6s ease';
                        placeholder.style.opacity = '0';
                        img.style.opacity = '1';
                    });
                }
            });
        }

        // Initialize
        function init() {
            // === Scroll Reveal with IntersectionObserver ===
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

            // === Canvas Starfield Background ===
            initStarfield();
            // === Blur-up Placeholder ===
            initBlurUp();

            renderCharacters();
            renderGundams();

            // 渲染后重新初始化收藏心形、计数和结果显示
            setTimeout(() => {
                if (typeof initGundamHearts === 'function') initGundamHearts();
                if (typeof updateFavCountBadge === 'function') updateFavCountBadge();
                if (typeof updateGundamResultsCount === 'function') updateGundamResultsCount();
            }, 60);

            // 启动档案自动生长系统（严格每3分钟添加 1个高达机体 + 1个人物）
            // 队列内容均为纯SEED动漫原型，已检查并修正与官方动画不一致之处（Biological CPU分代、机体归属、时间线等）
            setTimeout(() => {
                if (typeof startArchiveGrowth === 'function') startArchiveGrowth();
            }, 2500);  // 稍微延后启动，降低与初始化冲突的风险

            // Robust entrance button listener (fixes enterWebsite ReferenceError)
            setTimeout(() => {
                const btn = document.getElementById('enter-archive-btn');
                if (btn && window.enterWebsite) {
                    btn.addEventListener('click', window.enterWebsite);
                } else if (btn) {
                    // Fallback: define enterWebsite if not present (defensive)
                    btn.addEventListener('click', () => {
                        const overlay = document.getElementById('seed-entrance');
                        if (overlay) overlay.style.display = 'none';
                    });
                }
            }, 300);
            
            // 全局键盘快捷键 (Nolan式沉浸操作 — 导演级档案控制)
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const modals = document.querySelectorAll('.fixed.inset-0');
                    if (modals.length > 0) {
                        modals[modals.length - 1].remove();
                    }
                }
                // R 键随机抽选已停用（应要求移除随机抽选交互）
                // if ((e.key.toLowerCase() === 'r') && !e.target.matches('input, textarea')) {
                //     e.preventDefault();
                //     if (window.surpriseMeGundam) window.surpriseMeGundam();
                // }
                // F 键 — 召唤命运旁白 (Nolan director's insight)
                if ((e.key.toLowerCase() === 'f') && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    if (window.showRandomCinematicNote) window.showRandomCinematicNote();
                }
                // / 键 — 快速聚焦搜索 (专业档案检索)
                if (e.key === '/' && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    const search = document.getElementById('gundam-search');
                    if (search) search.focus();
                }
            });

            // 事件委托：所有高达卡片点击打开详情 (最高效方式) + 命运共鸣效果
            const gundamSection = document.getElementById('gundams');
            if (gundamSection) {
                gundamSection.addEventListener('click', function(e) {
                    const card = e.target.closest('.gundam-card');
                    if (card && card.dataset.gundamId) {
                        const id = card.dataset.gundamId;
                        showGundamDetail(id);

                        // 命运共鸣：点击高达后，命运旁白短暂切换到该机体的台词
                        const teaser = document.getElementById('fate-teaser');
                        const data = gundamsData[id];
                        if (teaser && data) {
                            const originalHTML = teaser.innerHTML;
                            teaser.style.transition = 'all 0.2s';
                            teaser.innerHTML = `<i class="fa-solid fa-film text-[9px]"></i> <span>共鸣：${(data.cinematic || '命运的齿轮仍在转动……').substring(0,32)}...</span>`;
                            
                            setTimeout(() => {
                                if (teaser) teaser.innerHTML = originalHTML;
                            }, 2200);
                        }
                    }
                });
            }

            // ==================== 实时高达搜索 + 筛选 (使用 gundamsData) + FAVORITES MODE ====================
            const searchInput = document.getElementById('gundam-search');
            const filterBar = document.getElementById('gundam-filters');
            const gundamGrid = document.getElementById('gundam-grid') || document.querySelector('#gundams .grid');
            let showOnlyFavorites = false; // Premium personal filter state

            window.filterGundams = filterGundams;
            function filterGundams() {
                if (!gundamGrid) return;
                const keyword = (searchInput?.value || '').toLowerCase().trim();
                const activeFilter = filterBar?.querySelector('button.active')?.dataset.filter || 'all';

                const cards = gundamGrid.querySelectorAll('.gundam-card');

                cards.forEach(card => {
                    const id = card.dataset.gundamId;
                    const d = gundamsData[id];
                    if (!d) return;

                    const haystack = `${d.name || ''} ${d.nameCn || ''} ${d.pilot || ''} ${d.faction || ''} ${d.type || ''} ${d.intro || ''}`.toLowerCase();
                    const matchesSearch = !keyword || haystack.includes(keyword);

                    let matchesFilter = true;
                    if (activeFilter !== 'all') {
                        const f = (d.faction || '').toLowerCase();
                        if (activeFilter === 'ZAFT') matchesFilter = f.includes('zaft');
                        else if (activeFilter === '地球联合') matchesFilter = f.includes('地球') || f.includes('extended');
                        else if (activeFilter === '奥布') matchesFilter = f.includes('奥布');
                        else if (activeFilter === '终端') matchesFilter = f.includes('终端');
                        else if (activeFilter === 'Extended') matchesFilter = f.includes('extended');
                    }

                    // Favorites-only mode (My Archive filter)
                    let matchesFav = true;
                    if (showOnlyFavorites) {
                        matchesFav = (window.favorites && window.favorites.gundams && window.favorites.gundams.includes(id));
                    }

                    card.style.display = (matchesSearch && matchesFilter && matchesFav) ? '' : 'none';
                });

                // 更新实时结果计数
                if (typeof updateGundamResultsCount === 'function') {
                    updateGundamResultsCount();
                }

                // Subtle "archive settling" wave on visible cards for organic smoothness (Nolan tension release)
                if (window.gsap) {
                    const visibleCards = Array.from(gundamGrid.querySelectorAll('.gundam-card')).filter(c => c.style.display !== 'none');
                    if (visibleCards.length > 0) {
                        gsap.fromTo(visibleCards, 
                            { y: -3, opacity: 0.85 },
                            { 
                                y: 0, 
                                opacity: 1, 
                                duration: 0.35, 
                                stagger: 0.015, 
                                ease: "power2.out",
                                delay: 0.05
                            }
                        );
                    }
                }
            }

            // Wire the new premium MY ARCHIVE toggle button (added in optimization pass)
            const favToggleBtn = document.getElementById('fav-toggle');
            if (favToggleBtn) {
                favToggleBtn.addEventListener('click', (e) => {
                    // Primary: Open the rich My Archive modal (cinematic personal dossier)
                    if (window.showMyArchive) {
                        window.showMyArchive();
                    }
                    
                    // Secondary (Shift or long-press feel): toggle favorites-only filter view
                    if (e.shiftKey) {
                        showOnlyFavorites = !showOnlyFavorites;
                        favToggleBtn.classList.toggle('!border-[#C5A26E]', showOnlyFavorites);
                        favToggleBtn.classList.toggle('!bg-[#C5A26E]/10', showOnlyFavorites);
                        filterGundams();
                    }
                });
                
                // Bonus: Double-click to activate pure favorites filter mode (Nolan-style focused view)
                favToggleBtn.addEventListener('dblclick', () => {
                    showOnlyFavorites = !showOnlyFavorites;
                    favToggleBtn.classList.toggle('!border-[#C5A26E]', showOnlyFavorites);
                    favToggleBtn.classList.toggle('!bg-[#C5A26E]/10', showOnlyFavorites);
                    filterGundams();
                    if (showOnlyFavorites) {
                        // subtle cinematic toast
                        const toast = document.createElement('div');
                        toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#C5A26E] text-black text-xs tracking-[2px] px-5 py-2 rounded-full z-[400]';
                        toast.textContent = showOnlyFavorites ? 'PERSONAL ARCHIVE FILTER ACTIVE' : 'ARCHIVE FILTER CLEARED';
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 1400);
                    }
                });
            }

            // Live update favorite count badge
            function updateFavCount() {
                const badge = document.getElementById('fav-count-badge');
                const btn = document.getElementById('fav-toggle');
                if (badge && window.favorites && window.favorites.gundams) {
                    const count = window.favorites.gundams.length;
                    badge.textContent = count;
                    if (btn) {
                        btn.setAttribute('aria-pressed', count > 0 ? 'true' : 'false');
                        btn.title = `我的私人高达档案（已收藏 ${count} 台）· 点击打开 · Shift+点击 或 双击激活筛选`;
                    }
                }
            }

            if (searchInput) {
                searchInput.addEventListener('input', filterGundams);
            }

            if (filterBar) {
                filterBar.querySelectorAll('button').forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active', 'border-[#C5A26E]', 'bg-[#C5A26E]', 'text-black'));
                        filterBar.querySelectorAll('button').forEach(b => b.classList.add('border-white/15'));
                        
                        btn.classList.add('active', 'border-[#C5A26E]', 'bg-[#C5A26E]', 'text-black');
                        btn.classList.remove('border-white/15');
                        // When changing faction filter, exit pure favs-only mode for clean UX
                        showOnlyFavorites = false;
                        if (favToggleBtn) favToggleBtn.classList.remove('!border-[#C5A26E]', '!bg-[#C5A26E]/10');
                        filterGundams();
                    });
                });
            }

            // 排序器联动动态渲染
            const sortSelect = document.getElementById('gundam-sort');
            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    const mode = sortSelect.value;
                    renderGundams(mode);
                    setTimeout(() => {
                        if (typeof initGundamHearts === 'function') initGundamHearts();
                        if (typeof updateFavCountBadge === 'function') updateFavCountBadge();
                        filterGundams();
                        if (typeof updateGundamResultsCount === 'function') updateGundamResultsCount();
                    }, 40);
                });
            }

            // 清除所有高达筛选
            window.clearGundamFilters = function() {
                const search = document.getElementById('gundam-search');
                const sort = document.getElementById('gundam-sort');
                if (search) search.value = '';
                if (sort) sort.value = 'default';
                
                // 重置按钮状态
                if (filterBar) {
                    filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active', 'border-[#C5A26E]', 'bg-[#C5A26E]', 'text-black'));
                    filterBar.querySelectorAll('button').forEach(b => b.classList.add('border-white/15'));
                    const allBtn = filterBar.querySelector('[data-filter="all"]');
                    if (allBtn) allBtn.classList.add('active', 'border-[#C5A26E]', 'bg-[#C5A26E]', 'text-black');
                }
                
                showOnlyFavorites = false;
                if (favToggleBtn) favToggleBtn.classList.remove('!border-[#C5A26E]', '!bg-[#C5A26E]/10');
                
                renderGundams('default');
                setTimeout(() => {
                    if (typeof initGundamHearts === 'function') initGundamHearts();
                    filterGundams();
                    updateGundamResultsCount();
                }, 30);
            };

            // 实时更新高达筛选结果计数 + 命运旁白联动
            function updateGundamResultsCount() {
                const grid = document.getElementById('gundam-grid');
                const countEl = document.getElementById('gundam-visible-count');
                const wrapper = document.getElementById('gundam-results-count');
                const summaryEl = document.getElementById('gundam-filter-summary');
                if (!grid || !countEl) return;

                const cards = grid.querySelectorAll('.gundam-card');
                const visible = Array.from(cards).filter(c => c.style.display !== 'none').length;
                const total = cards.length || 20;

                const prev = parseInt(countEl.textContent) || visible;

                // GSAP 数字递增动画 (电影感)
                if (window.gsap && prev !== visible) {
                    const obj = { val: prev };
                    gsap.to(obj, {
                        val: visible,
                        duration: 0.55,
                        ease: "power2.out",
                        onUpdate: () => {
                            countEl.textContent = Math.round(obj.val);
                        }
                    });
                } else {
                    countEl.textContent = visible;
                }

                // 构建筛选状态摘要
                let summaryText = '';
                const searchVal = (document.getElementById('gundam-search')?.value || '').trim();
                const activeFilterBtn = document.querySelector('#gundam-filters button.active');
                const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
                const isFavOnly = typeof showOnlyFavorites !== 'undefined' && showOnlyFavorites;

                if (searchVal) summaryText += `“${searchVal}” `;
                if (activeFilter !== 'all') summaryText += `${activeFilter} `;
                if (isFavOnly) summaryText += '已收藏 ';

                if (summaryEl) {
                    summaryEl.textContent = summaryText.trim() ? `· ${summaryText.trim()}` : '';
                }

                // 动态更新 wrapper 文案
                if (wrapper) {
                    const baseText = visible === total 
                        ? `显示 <span id="gundam-visible-count">${visible}</span> / ${total}` 
                        : `筛选后 <span id="gundam-visible-count">${visible}</span> / ${total}`;
                    
                    wrapper.innerHTML = baseText + (summaryEl ? summaryEl.outerHTML : '');
                    
                    // 电影感脉冲 + 当有活跃筛选时更强烈的 "fate tension" 光晕
                    if (window.gsap) {
                        const hasFilter = summaryText.trim().length > 0;
                        const intensity = hasFilter ? 9 : 6;
                        gsap.fromTo(wrapper, 
                            { boxShadow: "0 0 0 0 rgba(197,162,110,0.5)" }, 
                            { 
                                boxShadow: `0 0 0 ${intensity}px rgba(197,162,110,0)`, 
                                duration: hasFilter ? 1.1 : 0.8, 
                                ease: "power2.out" 
                            }
                        );
                    }
                    
                    // 绑定点击清除（仅绑定一次）
                    if (!wrapper._clickBound) {
                        wrapper.addEventListener('click', () => {
                            if (window.clearGundamFilters) window.clearGundamFilters();
                        });
                        wrapper._clickBound = true;
                    }
                }

                // 命运旁白 teaser 联动：根据当前筛选推荐相关旁白
                updateFateTeaserWithCurrentFilter(visible, activeFilter, isFavOnly, searchVal);
            }

            function updateFateTeaserWithCurrentFilter(visibleCount, activeFilter, isFavOnly, searchVal) {
                const teaser = document.getElementById('fate-teaser');
                if (!teaser || !window.gundamsData) return;

                let relevantKeys = Object.keys(gundamsData);

                // 简单智能推荐
                if (activeFilter !== 'all') {
                    relevantKeys = relevantKeys.filter(k => {
                        const d = gundamsData[k];
                        if (!d) return false;
                        const f = (d.faction || '').toLowerCase();
                        if (activeFilter === 'ZAFT') return f.includes('zaft');
                        if (activeFilter === '地球联合') return f.includes('地球') || f.includes('extended');
                        if (activeFilter === '奥布') return f.includes('奥布');
                        if (activeFilter === '终端') return f.includes('终端');
                        if (activeFilter === 'Extended') return f.includes('extended');
                        return true;
                    });
                }

                if (relevantKeys.length === 0) relevantKeys = Object.keys(gundamsData);

                const randomKey = relevantKeys[Math.floor(Math.random() * relevantKeys.length)];
                const data = gundamsData[randomKey];
                const note = (data && data.cinematic) || '命运的齿轮仍在转动……';
                const short = note.length > 38 ? note.substring(0, 35) + '...' : note;

                const pulse = document.getElementById('fate-teaser-pulse');
                
                if (window.gsap) {
                    // Premium cinematic fate morph: fade content only, preserve structure for smoothness
                    if (pulse) {
                        gsap.to(pulse, { opacity: 0.55, duration: 0.08, onComplete: () => {
                            gsap.to(pulse, { opacity: 0, duration: 1.6, ease: "power2.out" });
                        }});
                    }
                    
                    gsap.to(teaser, { 
                        opacity: 0.28, 
                        duration: 0.18, 
                        ease: "power1.in",
                        onComplete: () => {
                            // Poetic fate thread underline update
                            const fateThread = `<span class="fate-thread absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-[#C5A26E] to-transparent opacity-40"></span>`;
                            teaser.innerHTML = `<i class="fa-solid fa-film text-[9px]"></i> 命运旁白（${data.nameCn}）：${short} <span class="text-[9px] opacity-55">(点击展开)</span>${fateThread}`;
                            
                            // Cinematic staggered word reveal for the fate quote (more Nolan visual poetry)
                            const words = teaser.querySelectorAll('span:not(.fate-thread)');
                            if (words.length) {
                                gsap.fromTo(words, 
                                    { opacity: 0, y: 4 },
                                    { 
                                        opacity: 1, 
                                        y: 0, 
                                        duration: 0.35, 
                                        stagger: 0.06, 
                                        ease: "power2.out" 
                                    }
                                );
                            } else {
                                gsap.to(teaser, { 
                                    opacity: 1, 
                                    duration: 0.42, 
                                    ease: "power2.out" 
                                });
                            }

                            // Fate resonance: softly illuminate 1-2 matching cards with poetic "chosen by fate" glow
                            const matchingCards = Array.from(document.querySelectorAll('#gundam-grid .gundam-card'))
                                .filter(c => c.dataset.gundamId === randomKey && c.style.display !== 'none');
                            matchingCards.forEach((card, i) => {
                                gsap.to(card, {
                                    boxShadow: "0 0 0 3px rgba(197,162,110,0.4), 0 0 12px rgba(197,162,110,0.2)",
                                    scale: 1.015,
                                    duration: 0.25,
                                    delay: i * 0.04,
                                    onComplete: () => {
                                        gsap.to(card, {
                                            boxShadow: "0 30px 70px -15px rgb(0 0 0 / 0.55)",
                                            scale: 1,
                                            duration: 1.8,
                                            ease: "power2.out"
                                        });
                                    }
                                });
                            });
                        }
                    });
                } else {
                    teaser.innerHTML = `<i class="fa-solid fa-film text-[9px]"></i> 命运旁白（${data.nameCn}）：${short} <span class="text-[9px] opacity-60">(点击展开)</span>`;
                }
            }

            // 手动刷新命运旁白 (独立于筛选) - upgraded cinematic delight
            window.refreshFateTeaser = function() {
                const teaser = document.getElementById('fate-teaser');
                if (!teaser || !window.gundamsData) return;

                const keys = Object.keys(gundamsData);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const data = gundamsData[randomKey];
                const note = (data && data.cinematic) || '命运的齿轮仍在转动……';
                const short = note.length > 38 ? note.substring(0, 35) + '...' : note;

                if (window.gsap) {
                    gsap.to(teaser, { 
                        opacity: 0.25, 
                        duration: 0.14, 
                        ease: "power1.in",
                        onComplete: () => {
                            const fateThread = `<span class="fate-thread absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-[#C5A26E] to-transparent opacity-40"></span>`;
                            teaser.innerHTML = `<i class="fa-solid fa-film text-[9px]"></i> 命运旁白（${data.nameCn}）：${short} <span class="text-[9px] opacity-55">(点击展开)</span>${fateThread}`;
                            gsap.to(teaser, { opacity: 1, duration: 0.38, ease: "power2.out" });
                        }
                    });
                } else {
                    teaser.style.transition = 'opacity 0.15s';
                    teaser.style.opacity = '0.3';
                    setTimeout(() => {
                        teaser.innerHTML = `命运旁白（${data.nameCn}）：${short} <span class="text-[9px] opacity-60">(点击展开)</span>`;
                        teaser.style.opacity = '1';
                    }, 120);
                }
            };

            // ==================== MY ARCHIVE 收藏系统 (localStorage 持久化) - Enhanced in optimization ====================
            window.favorites = JSON.parse(localStorage.getItem('gundamArchiveFavorites') || '{"gundams":[],"pilots":[]}');

            window.saveFavorites = function() {
                localStorage.setItem('gundamArchiveFavorites', JSON.stringify(window.favorites));
                updateFavCountBadge();
            };

            function updateFavCountBadge() {
                const badge = document.getElementById('fav-count-badge');
                if (!badge) return;
                const total = (window.favorites.gundams?.length || 0) + (window.favorites.pilots?.length || 0);
                badge.textContent = total;
                badge.style.display = total > 0 ? 'inline-block' : 'none';
            }

            window.toggleFavorite = function(type, id, btnElement) {
                if (!window.favorites[type]) window.favorites[type] = [];
                
                const idx = window.favorites[type].indexOf(id);
                if (idx > -1) {
                    window.favorites[type].splice(idx, 1);
                    if (btnElement) btnElement.classList.remove('text-[#C8102E]', 'fa-solid');
                    if (btnElement) btnElement.classList.add('text-white/60', 'fa-regular');
                } else {
                    window.favorites[type].push(id);
                    if (btnElement) btnElement.classList.add('text-[#C8102E]', 'fa-solid');
                    if (btnElement) btnElement.classList.remove('text-white/60', 'fa-regular');
                }
                window.saveFavorites();
                updateFavCountBadge();
            };

            window.generateFateSummary = function(btn) {
                const favGundams = (window.favorites.gundams || []).map(id => gundamsData[id]).filter(Boolean);
                const favPilots = (window.favorites.pilots || []).map(id => characters.find(c => c.id === id)).filter(Boolean);

                if (favGundams.length === 0 && favPilots.length === 0) {
                    btn.textContent = "先收藏一些高达或人物吧...";
                    setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-scroll"></i> <span>生成命运摘要 (Nolan风格诗意报告)</span>'; }, 1400);
                    return;
                }

                const gundamNames = favGundams.map(g => g.nameCn).slice(0, 3).join("、");
                const pilotNames = favPilots.map(p => p.name).slice(0, 2).join("、");

                let poetic = `在命运的褶皱中，时间选择了你。`;
                if (gundamNames) poetic += `你让 ${gundamNames} 的光翼在档案中永存。`;
                if (pilotNames) poetic += ` ${pilotNames} 的意志与你共振。`;
                poetic += ` 无论战场如何折叠，诺兰的镜头永远会记住这一刻的共鸣——那些被命运选中的人，终将改写历史。`;

                const summaryDiv = document.createElement('div');
                summaryDiv.className = 'mt-4 p-4 border border-[#C5A26E]/30 bg-black/40 rounded-2xl text-sm italic text-[#C5A26E]/90 leading-relaxed';
                summaryDiv.textContent = poetic;

                btn.parentNode.appendChild(summaryDiv);
                btn.style.display = 'none';

                if (window.gsap) {
                    gsap.fromTo(summaryDiv, { opacity: 0, y: 12, filter: 'blur(1px)' }, { opacity: 1, y: 0, filter: 'none', duration: 0.75, ease: "power2.out" });
                }
            };

            window.showMyArchive = function() {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';

                // Round 1: 动态计算解锁进度
                setTimeout(() => {
                    const total = (window.favorites.gundams?.length || 0) + (window.favorites.pilots?.length || 0) + (window.favorites.videoMoments?.length || 0);
                    const progress = Math.min(100, Math.floor(total * 4.5));
                    const level = progress >= 70 ? 'Lv.4 档案官' : progress >= 40 ? 'Lv.3 记录者' : 'Lv.2 见习协调者';
                    const textEl = document.getElementById('archive-progress-text');
                    const levelEl = document.getElementById('archive-progress-level');
                    if (textEl) textEl.textContent = progress + '%';
                    if (levelEl) levelEl.textContent = 'Terminal ' + level;
                }, 120);
                modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

                const favGundams = (window.favorites.gundams || []).map(id => gundamsData[id]).filter(Boolean);
                const favPilots = (window.favorites.pilots || []).map(id => characters.find(c => c.id === id)).filter(Boolean);

                let content = `
                    <div class="max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <div class="px-8 py-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px]">TERMINAL PERSONAL ARCHIVE</div>
                                <div class="text-3xl font-bold">My Archive</div>
                                <!-- Round 1: 解锁进度 (动态) -->
                                <div class="mt-1 text-xs text-[#C5A26E]/80">
                                    解锁进度：<span id="archive-progress-text">0%</span>
                                    <span id="archive-progress-level" class="ml-2 text-[10px] px-2 py-0.5 rounded bg-[#C5A26E]/10">Terminal Lv.1</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <button onclick="exportMyArchive()" 
                                        class="text-xs px-4 py-2 border border-white/20 hover:bg-white/5 rounded-xl flex items-center gap-2">
                                    <i class="fa-solid fa-download"></i>
                                    <span>导出档案</span>
                                </button>
                                <button onclick="importMyArchive()" 
                                        class="text-xs px-4 py-2 border border-white/20 hover:bg-white/5 rounded-xl flex items-center gap-2">
                                    <i class="fa-solid fa-upload"></i>
                                    <span>导入</span>
                                </button>
                                <button onclick="this.closest('.fixed').remove()" class="text-3xl text-white/40 hover:text-white ml-2">×</button>
                            </div>
                        </div>
                        <div class="p-8">
                `;

                if (favGundams.length === 0 && favPilots.length === 0) {
                    content += `
                        <div class="text-center py-12">
                            <i class="fa-solid fa-heart text-5xl text-white/10 mb-4"></i>
                            <div class="text-xl text-white/60">Your personal archive is empty</div>
                            <div class="text-sm text-white/40 mt-2">Click the heart icon on any Gundam or Pilot to save them here.</div>
                        </div>
                    `;
                } else {
                    if (favGundams.length > 0) {
                        content += `<div class="mb-8"><div class="text-[#C5A26E] text-xs tracking-widest mb-4">FAVORITE MOBILE SUITS (${favGundams.length})</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
                        favGundams.forEach(g => {
                            content += `
                                <div class="flex gap-4 bg-black/40 rounded-2xl p-4 group">
                                    <img src="${webpSrc(g.image)}" loading="lazy" decoding="async" width="80" height="80" alt="${g.nameCn || g.name || '机动战士'}" ${imgFallback(g.image)} class="w-20 h-20 object-cover rounded-xl flex-shrink-0">
                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold">${g.nameCn}</div>
                                        <div class="text-xs text-white/50">${g.model} · ${g.pilot}</div>
                                        <div class="mt-2 flex gap-2">
                                            <button onclick="showGundamDetail('${g.id}'); this.closest('.fixed').remove();" class="text-xs px-3 py-1 border border-white/20 rounded hover:bg-white/5">VIEW</button>
                                            <button onclick="window.toggleFavorite('gundams','${g.id}'); this.closest('.fixed').remove(); setTimeout(()=>window.showMyArchive(),80)" class="text-xs px-3 py-1 text-[#C8102E] hover:text-red-400">REMOVE</button>
                                        </div>
                                    </div>
                                </div>`;
                        });
                        content += `</div></div>`;
                    }

                    if (favPilots.length > 0) {
                        content += `<div><div class="text-[#C5A26E] text-xs tracking-widest mb-4">FAVORITE PILOTS (${favPilots.length})</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
                        favPilots.forEach(p => {
                            content += `
                                <div class="flex gap-4 bg-black/40 rounded-2xl p-4">
                                    <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                                        ${p.image ? `<img src="${webpSrc(p.image)}" loading="lazy" decoding="async" width="64" height="64" alt="${p.name || '驾驶员'}" ${imgFallback(p.image, null)} class="w-full h-full object-cover">` : ''}
                                    </div>
                                    <div class="flex-1">
                                        <div class="font-semibold">${p.name}</div>
                                        <div class="text-xs text-white/50">${p.faction}</div>
                                        <div class="mt-2">
                                            <button onclick="showCharacterDetail(characters.find(c=>c.id==='${p.id}')); this.closest('.fixed').remove();" class="text-xs px-3 py-1 border border-white/20 rounded hover:bg-white/5">VIEW PROFILE</button>
                                        </div>
                                    </div>
                                </div>`;
                        });
                        content += `</div></div>`;
                    }
                }

                content += `</div>`;

                // Quick Export / Import actions inside the personal archive modal (better UX + cinematic feel)
                content += `
                    <div class="flex gap-3 px-8 py-5 bg-black/30 border-t border-white/10">
                        <button onclick="window.exportMyArchive(); this.closest('.fixed').remove();" 
                                class="flex-1 py-2.5 text-sm border border-[#C5A26E]/60 hover:bg-[#C5A26E] hover:text-black rounded-2xl transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-download"></i> <span>导出个人档案</span>
                        </button>
                        <button onclick="window.importMyArchive(); this.closest('.fixed').remove();" 
                                class="flex-1 py-2.5 text-sm border border-white/30 hover:bg-white/5 rounded-2xl transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-upload"></i> <span>导入个人档案</span>
                        </button>
                    </div>
                    <div class="bg-black/40 px-8 py-4 text-[10px] text-white/40 text-center border-t border-white/10">Stored locally in your browser • Cosmic Era Personal Archive</div>
                `;

                modal.innerHTML = content;
                document.body.appendChild(modal);
            };

            // ==================== 导出 / 导入个人档案 (Classified Dossier 功能 - 诺兰式个人记录感) ====================
            window.exportMyArchive = function() {
                const data = {
                    version: "1.0",
                    exportedAt: new Date().toISOString(),
                    favorites: window.favorites || { gundams: [], pilots: [] }
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `SEED_Personal_Archive_${new Date().toISOString().slice(0,10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            window.importMyArchive = function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        try {
                            const imported = JSON.parse(ev.target.result);
                            if (imported.favorites) {
                                window.favorites = imported.favorites;
                                window.saveFavorites();
                                // Beautiful Nolan-style success toast
                                const successToast = document.createElement('div');
                                successToast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#111] border border-[#C5A26E] text-sm rounded-2xl z-[450] flex items-center gap-3 shadow-2xl';
                                successToast.innerHTML = `
                                    <i class="fa-solid fa-check-circle text-[#C5A26E]"></i>
                                    <div>
                                        <div class="text-[#C5A26E] text-xs tracking-[2px]">ARCHIVE RESTORED</div>
                                        <div>个人档案导入成功</div>
                                    </div>
                                `;
                                document.body.appendChild(successToast);
                                setTimeout(() => successToast.remove(), 2600);

                                // Refresh My Archive modal if open
                                const currentModal = document.querySelector('.fixed.inset-0');
                                if (currentModal) currentModal.remove();
                                setTimeout(() => window.showMyArchive(), 80);
                            }
                        } catch (err) {
                            // Cinematic error toast instead of alert
                            const errToast = document.createElement('div');
                            errToast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#C8102E]/90 text-white text-sm rounded-2xl z-[450] flex items-center gap-2';
                            errToast.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> <span>档案格式错误，导入失败</span>`;
                            document.body.appendChild(errToast);
                            setTimeout(() => errToast.remove(), 2800);
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            };

            // 初始化高达卡片上的收藏心形按钮
            function initGundamHearts() {
                const cards = document.querySelectorAll('.gundam-card[data-gundam-id]');
                cards.forEach(card => {
                    const id = card.dataset.gundamId;
                    const imgContainer = card.querySelector('.h-80') || card;
                    
                    // 避免重复添加
                    if (card.querySelector('.fav-heart')) return;

                    const heart = document.createElement('button');
                    heart.className = `fav-heart absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center text-lg transition`;
                    const isFav = (window.favorites.gundams || []).includes(id);
                    heart.innerHTML = `<i class="fa-${isFav ? 'solid' : 'regular'} fa-heart ${isFav ? 'text-[#C8102E]' : 'text-white/60'}"></i>`;
                    
                    heart.onclick = (e) => {
                        e.stopImmediatePropagation();
                        const icon = heart.querySelector('i');
                        window.toggleFavorite('gundams', id, icon);
                    };
                    
                    imgContainer.style.position = 'relative';
                    imgContainer.appendChild(heart);
                });
            }

            // 在角色卡片渲染时注入收藏功能（增强现有 render）
            const originalRenderCharacters = window.renderCharacters || renderCharacters;
            window.renderCharacters = function() {
                originalRenderCharacters();
                // 给角色卡添加收藏心形
                setTimeout(() => {
                    const charCards = document.querySelectorAll('#character-grid .character-card');
                    charCards.forEach(card => {
                        if (card.querySelector('.fav-heart')) return;
                        const nameEl = card.querySelector('.text-2xl');
                        if (!nameEl) return;
                        
                        const charName = nameEl.textContent.trim();
                        const charData = characters.find(c => c.name === charName);
                        if (!charData) return;

                        const heart = document.createElement('button');
                        heart.className = `fav-heart absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center text-base`;
                        const isFav = (window.favorites.pilots || []).includes(charData.id);
                        heart.innerHTML = `<i class="fa-${isFav ? 'solid' : 'regular'} fa-heart ${isFav ? 'text-[#C8102E]' : 'text-white/50'}"></i>`;
                        
                        heart.onclick = (e) => {
                            e.stopImmediatePropagation();
                            const icon = heart.querySelector('i');
                            window.toggleFavorite('pilots', charData.id, icon);
                        };
                        
                        card.style.position = 'relative';
                        card.appendChild(heart);
                    });
                }, 80);
            };

            // 启动收藏心形
            initGundamHearts();

            // 初始化收藏数量徽章（实时显示）
            if (typeof updateFavCountBadge === 'function') updateFavCountBadge();

            // 初始结果计数 + 命运联动
            if (typeof updateGundamResultsCount === 'function') {
                setTimeout(() => {
                    updateGundamResultsCount();
                    // 额外触发一次命运旁白智能推荐
                    if (typeof updateFateTeaserWithCurrentFilter === 'function' && document.getElementById('gundam-results-count')) {
                        const grid = document.getElementById('gundam-grid');
                        if (grid) {
                            const visible = grid.querySelectorAll('.gundam-card:not([style*="display: none"])').length || 17;
                            updateFateTeaserWithCurrentFilter(visible, 'all', false, '');
                        }
                    }
                }, 180);
            }

            // 初始化今日命运旁白 teaser (随机显示一条简短 cinematic)
            setTimeout(() => {
                const teaser = document.getElementById('fate-teaser');
                if (teaser && window.gundamsData) {
                    const keys = Object.keys(gundamsData);
                    const randomKey = keys[Math.floor(Math.random() * keys.length)];
                    const note = (gundamsData[randomKey] && gundamsData[randomKey].cinematic) || '';
                    const short = note ? (note.length > 42 ? note.substring(0, 39) + '...' : note) : '命运的齿轮仍在转动……';
                    teaser.innerHTML = `命运旁白：${short} <span class="text-[9px] opacity-60">(点击展开)</span>`;
                    teaser.onclick = () => window.showRandomCinematicNote();

                    // Subtle living archive projector flicker (Nolan atmosphere)
                    setInterval(() => {
                        if (teaser && document.visibilityState === 'visible' && !teaser.closest('.fixed')) {
                            if (window.gsap) {
                                gsap.to(teaser, { opacity: 0.65, duration: 0.06, onComplete: () => {
                                    if (teaser) gsap.to(teaser, { opacity: 1, duration: 0.25, ease: "power2.out" });
                                }});
                            } else {
                                teaser.style.transition = 'opacity 0.08s';
                                teaser.style.opacity = '0.6';
                                setTimeout(() => { if (teaser) teaser.style.opacity = '1'; }, 120);
                            }
                        }
                    }, 9500 + Math.random() * 4000);
                }
            }, 800);

            // 诺兰式时间线入场动画 (使用已加载的 GSAP)
            setTimeout(() => {
                const timeline = document.getElementById('cosmic-timeline');
                if (timeline && window.gsap) {
                    const items = timeline.querySelectorAll('.relative');
                    gsap.fromTo(items, 
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", delay: 0.3 }
                    );
                }

                // 使时间线可交互：点击事件打开相关高达详情 (Nolan 时间折叠感)
                if (timeline) {
                    const timelineItems = timeline.querySelectorAll('.relative');
                    const eventMap = {
                        0: 'strike',      // 血染的开端 → Strike
                        1: 'strike',      // Heliopolis → Strike
                        2: 'freedom',     // 自由与正义诞生
                        3: 'impulse',     // 命运的少年
                        4: null,          // 命运计划 (杜兰达尔相关)
                        5: 'strike-freedom' // 光翼下的和平
                    };

                    timelineItems.forEach((item, index) => {
                        item.style.cursor = 'pointer';
                        const gundamId = eventMap[index];
                        
                        // Click still opens detail (Nolan fate collapse)
                        item.addEventListener('click', () => {
                            // Enhanced Nolan "time fold" — heavier, more emotional cinematic collapse
                            const mainContent = document.querySelector('main') || document.body;
                            item.classList.add('time-fold');

                            if (window.gsap) {
                                // Stronger desaturation + subtle grain pulse
                                gsap.to(mainContent, {
                                    filter: 'contrast(0.78) saturate(0.55) brightness(0.92)',
                                    duration: 0.25,
                                    ease: "power1.in",
                                    onComplete: () => {
                                        if (gundamId && gundamsData[gundamId]) {
                                            document.querySelectorAll('.fixed.inset-0').forEach(m => m.remove());
                                            setTimeout(() => {
                                                showGundamDetail(gundamId);
                                                gsap.to(mainContent, { 
                                                    filter: 'none', 
                                                    duration: 1.1, 
                                                    ease: "power2.out" 
                                                });
                                            }, 180);
                                        } else {
                                            const toast = document.createElement('div');
                                            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#111] border border-white/20 text-sm rounded-2xl z-[400]';
                                            toast.textContent = '这一刻改变了整个宇宙的轨迹...';
                                            document.body.appendChild(toast);
                                            setTimeout(() => {
                                                toast.remove();
                                                gsap.to(mainContent, { filter: 'none', duration: 1.0, ease: "power2.out" });
                                            }, 1600);
                                        }
                                    }
                                });
                            } else {
                                if (gundamId && gundamsData[gundamId]) {
                                    document.querySelectorAll('.fixed.inset-0').forEach(m => m.remove());
                                    setTimeout(() => showGundamDetail(gundamId), 150);
                                } else {
                                    const toast = document.createElement('div');
                                    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#111] border border-white/20 text-sm rounded-2xl z-[400]';
                                    toast.textContent = '这一刻改变了整个宇宙的轨迹...';
                                    document.body.appendChild(toast);
                                    setTimeout(() => toast.remove(), 1800);
                                }
                            }
                        });

                        // Fate resonance: Hovering a timeline event gently highlights linked Gundam card in grid (living archive magic)
                        if (gundamId) {
                            item.addEventListener('mouseenter', () => {
                                const linkedCard = document.querySelector(`.gundam-card[data-gundam-id="${gundamId}"]`);
                                if (linkedCard && linkedCard.style.display !== 'none') {
                                    linkedCard.style.transition = 'box-shadow 0.2s ease, border-color 0.2s ease';
                                    linkedCard.style.boxShadow = '0 0 0 1px #C5A26E, 0 20px 45px -10px rgb(0 0 0 / 0.6)';
                                    linkedCard.style.borderColor = '#C5A26E';
                                }

                                // Bonus: Also pulse related character cards for deeper fate immersion (e.g. Lacus with Freedom)
                                const relatedCharIds = (gundamId === 'freedom' || gundamId === 'strike-freedom') ? ['lacus', 'kira'] : [];
                                relatedCharIds.forEach(cid => {
                                    const cCard = Array.from(document.querySelectorAll('#character-grid .character-card'))
                                        .find(c => c.textContent.includes(cid === 'lacus' ? '拉克丝' : '基拉'));
                                    if (cCard) {
                                        cCard.style.transition = 'box-shadow 0.25s ease';
                                        cCard.style.boxShadow = '0 0 0 1px #C5A26E, 0 12px 30px -8px rgb(0 0 0 / 0.5)';
                                    }
                                });
                            });
                            item.addEventListener('mouseleave', () => {
                                const linkedCard = document.querySelector(`.gundam-card[data-gundam-id="${gundamId}"]`);
                                if (linkedCard) {
                                    linkedCard.style.boxShadow = '';
                                    linkedCard.style.borderColor = '';
                                }
                                // Clear character pulses
                                document.querySelectorAll('#character-grid .character-card').forEach(c => {
                                    c.style.boxShadow = '';
                                });
                            });
                        }
                    });
                }
            }, 900);

            // 重新渲染一次角色以注入心形
            setTimeout(() => {
                const grid = document.getElementById('character-grid');
                if (grid && grid.children.length > 0) {
                    const charCards = document.querySelectorAll('#character-grid .character-card');
                    charCards.forEach(card => {
                        if (card.querySelector('.fav-heart')) return;
                    });
                }
            }, 200);

            // ==================== 优化：收藏系统收尾与实时同步 (Premium live archive) ====================
            if (typeof updateFavCount === 'function') updateFavCount();

            // Patch toggleFavorite to live-update count + re-apply filters + refresh hearts subtly
            const originalToggleFav = window.toggleFavorite;
            window.toggleFavorite = function(type, id, btnElement) {
                originalToggleFav(type, id, btnElement);
                updateFavCount();
                
                // If currently viewing favorites-only, re-filter live
                // (filterGundams is defined inside init(); access via window and let it read its own filter state)
                if (typeof window.filterGundams === 'function') {
                    window.filterGundams();
                }
                
                // Gentle refresh of all hearts after toggle (ensures visual sync across cards)
                setTimeout(() => {
                    const allHearts = document.querySelectorAll('.fav-heart');
                    allHearts.forEach(h => {
                        const card = h.closest('.gundam-card') || h.closest('.character-card');
                        if (!card) return;
                        const cardId = card.dataset.gundamId || (card.querySelector && card.querySelector('.text-2xl')?.textContent.trim());
                        // Note: simple visual re-sync handled by original toggle
                    });
                }, 60);
            };

            // Initial filter pass (in case) — defer lookup so the init()-scoped function is resolved at call time
            setTimeout(() => { if (typeof window.filterGundams === 'function') window.filterGundams(); }, 120);

            // A11y + keyboard enhancement for Gundam cards (premium accessible archive)
            setTimeout(() => {
                try {
                    document.querySelectorAll('.gundam-card').forEach(card => {
                        if (!card.hasAttribute('tabindex')) {
                            card.setAttribute('tabindex', '0');
                            card.setAttribute('role', 'button');
                            const title = card.querySelector('.font-semibold')?.textContent || '高达';
                            card.setAttribute('aria-label', `查看 ${title} 详细档案`);
                        }
                        // Enter / Space key support
                        card.addEventListener('keydown', (ev) => {
                            if (ev.key === 'Enter' || ev.key === ' ') {
                                ev.preventDefault();
                                const id = card.dataset.gundamId;
                                if (id && window.showGundamDetail) window.showGundamDetail(id);
                            }
                        });
                    });
                } catch (e) {
                    console.warn('A11y enhancement skipped:', e);
                }
            }, 400);
        
        
        }

        // ==================== 专业关键帧对战视频播放器 (最接近真实视频的方案) ====================
        window.playRealBattleVideo = function() {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';

            modal.innerHTML = `
                <div class="max-w-6xl w-full bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/10">
                    <!-- Header -->
                    <div class="px-8 py-5 flex justify-between items-center border-b border-white/10">
                        <div>
                            <div class="text-[#C5A26E] text-xs tracking-[3px] mb-1">COSMIC ERA • AI GENERATED 4K KEYFRAMES</div>
                            <div class="text-3xl font-bold">强袭自由高达 vs 正义高达</div>
                            <div class="text-sm text-white/60">基拉·大和 × 阿斯兰·萨拉 · 宿命之战</div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="text-4xl text-white/30 hover:text-white">×</button>
                    </div>

                    <!-- Video Area -->
                    <div class="relative bg-black">
                        <img id="battle-frame"
                             src="assets/gundam/battle01_saber_clash.webp"
                             onerror="if(this.src.indexOf('.webp')>-1){this.src=this.src.replace('.webp','.jpg');}"
                             decoding="async" width="1280" height="720"
                             alt="高达对战关键帧"
                             class="w-full" style="aspect-ratio: 16 / 9; object-fit: cover; image-rendering: crisp-edges;">
                        
                        <!-- Cinematic Overlay -->
                        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.25) 100%);"></div>
                        
                        <!-- Controls -->
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/70 p-5">
                            <div class="flex items-center gap-4">
                                <!-- Play/Pause -->
                                <button id="play-btn" onclick="window.toggleBattlePlayback()" 
                                        class="w-11 h-11 flex items-center justify-center bg-white text-black rounded-full hover:bg-[#C5A26E] transition">
                                    <i class="fa-solid fa-play text-lg ml-0.5" id="play-icon"></i>
                                </button>

                                <!-- Progress -->
                                <div class="flex-1 flex items-center gap-3">
                                    <div class="flex-1 bg-white/20 h-[3px] rounded-full overflow-hidden cursor-pointer" 
                                         onclick="window.seekBattleVideo(event)">
                                        <div id="progress-bar" class="bg-[#C8102E] h-full transition-all" style="width: 0%"></div>
                                    </div>
                                    <div class="text-xs text-white/60 w-16 text-right font-mono" id="time-display">00:00 / 00:08</div>
                                </div>

                                <!-- Speed -->
                                <div class="flex items-center gap-2 text-xs">
                                    <span class="text-white/50">速度</span>
                                    <select id="speed-select" onchange="window.changeBattleSpeed()" 
                                            class="bg-black border border-white/20 text-white rounded px-2 py-1 text-xs">
                                        <option value="0.5">0.5x</option>
                                        <option value="0.75">0.75x</option>
                                        <option value="1" selected>1.0x</option>
                                        <option value="1.5">1.5x</option>
                                        <option value="2">2.0x</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-8 py-4 text-xs text-white/50 flex justify-between items-center">
                        <div>6 张 AI 生成关键帧 · 电影级还原</div>
                        <div class="text-[#C5A26E]">点击进度条可跳转</div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 初始化播放器
            window.battlePlayer = {
                frames: [
                    "assets/gundam/battle01_saber_clash.jpg",
                    "assets/gundam/battle02_dragoons.jpg",
                    "assets/gundam/battle03_dodge.jpg",
                    "assets/gundam/battle04_wing_charge.jpg",
                    "assets/gundam/battle05_saber_clash2.jpg",
                    "assets/gundam/battle06_wide_charge.jpg"
                ],
                currentIndex: 0,
                isPlaying: false,
                interval: null,
                speed: 1,
                modal: modal
            };

            // 初始显示第一帧
            document.getElementById('battle-frame').src = webpSrc(window.battlePlayer.frames[0]);
            updateBattleProgress();
        };

        window.toggleBattlePlayback = function() {
            const player = window.battlePlayer;
            if (!player) return;

            const icon = document.getElementById('play-icon');

            if (player.isPlaying) {
                clearInterval(player.interval);
                player.isPlaying = false;
                icon.className = 'fa-solid fa-play text-lg ml-0.5';
            } else {
                player.isPlaying = true;
                icon.className = 'fa-solid fa-pause text-lg';

                const fps = 1000 / (750 / player.speed); // 基础750ms一帧

                player.interval = setInterval(() => {
                    player.currentIndex = (player.currentIndex + 1) % player.frames.length;
                    document.getElementById('battle-frame').src = webpSrc(player.frames[player.currentIndex]);
                    updateBattleProgress();

                    // 播放音效
                    if (player.currentIndex % 2 === 0) playBeamSound();
                    if (player.currentIndex === 0) playExplosionSound();
                }, 750 / player.speed);
            }
        };

        window.seekBattleVideo = function(e) {
            const player = window.battlePlayer;
            if (!player) return;

            const progressContainer = e.currentTarget;
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newIndex = Math.floor(percent * player.frames.length);

            player.currentIndex = Math.min(newIndex, player.frames.length - 1);
            document.getElementById('battle-frame').src = player.frames[player.currentIndex];
            updateBattleProgress();
        };

        window.changeBattleSpeed = function() {
            const player = window.battlePlayer;
            if (!player) return;

            const select = document.getElementById('speed-select');
            player.speed = parseFloat(select.value);

            if (player.isPlaying) {
                clearInterval(player.interval);
                player.isPlaying = false;
                window.toggleBattlePlayback(); // 重新开始播放以应用新速度
            }
        };

        function updateBattleProgress() {
            const player = window.battlePlayer;
            if (!player) return;

            const progress = document.getElementById('progress-bar');
            const timeDisplay = document.getElementById('time-display');

            const percent = ((player.currentIndex + 1) / player.frames.length) * 100;
            progress.style.width = percent + '%';

            const currentSec = Math.floor((player.currentIndex / player.frames.length) * 8);
            const totalSec = 8;
            timeDisplay.textContent = `0:${currentSec.toString().padStart(2,'0')} / 0:${totalSec}`;
        }

        // 简单音效
        function playBeamSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc.type = 'sawtooth';
                osc.frequency.value = 280;
                filter.type = 'lowpass';
                filter.frequency.value = 1200;
                gain.gain.value = 0.12;

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.55);
                osc.onended = () => ctx.close().catch(() => {});
                setTimeout(() => { try { osc.stop(); } catch(e) {} }, 700);
            } catch(e) {}
        }

        function playExplosionSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const noise = ctx.createBufferSource();
                const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 800;

                const gain = ctx.createGain();
                gain.gain.value = 0.25;

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.onended = () => ctx.close().catch(() => {});
                noise.start();
                noise.stop(ctx.currentTime + 0.6);
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            } catch(e) {}
        }

        // ==================== 势力详情模态 (点击势力卡片弹出) - 已优化：统一关闭按钮 + 背景点击关闭 ====================
        window.showFactionDetail = function(faction) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';

            // 背景点击关闭
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };

            let inner = '';

            if (faction === 'zaft') {
                inner = `
                    <div class="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                                class="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-3xl text-white/60 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition">×</button>
                        <picture><source type="image/webp" srcset="assets/gundam/faction_zaft-480w.webp 480w, assets/gundam/faction_zaft-960w.webp 960w, assets/gundam/faction_zaft.webp 1440w" sizes="(max-width: 768px) 100vw, 900px"><img loading="lazy" decoding="async" width="900" height="320" src="assets/gundam/faction_zaft.jpg" class="w-full h-80 object-cover" alt="ZAFT 扎夫特组织"></picture>
                        <div class="p-10">
                            <div class="text-[#C8102E] text-sm tracking-[3px]">ZAFT</div>
                            <div class="text-5xl font-bold tracking-tight mt-1 mb-6">扎夫特</div>
                            
                            <div class="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-white/85">
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">组织概况</div>
                                    <p>Zodiac Alliance of Freedom Treaty（黄道自由条约同盟），简称ZAFT。是协调者（Coordinator）在PLANT太空殖民地建立的军事组织。</p>
                                    <p class="mt-3">在SEED时代，ZAFT是与地球联合军对立的另一大军事势力，拥有当时最先进的MS技术（如ZGMF系列）。</p>
                                </div>
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">关键人物</div>
                                    <p>帕特里克·萨拉、吉尔伯特·杜兰达尔、阿斯兰·萨拉、真·飞鸟、露娜玛丽亚·霍克等。</p>
                                    <div class="mt-4 text-[#C5A26E] text-xs tracking-widest mb-2">代表机体</div>
                                    <p>自由高达、正义高达、命运高达、脉冲高达等第二阶段及以后机体。</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (faction === 'earth_alliance') {
                inner = `
                    <div class="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                                class="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-3xl text-white/60 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition">×</button>
                        <picture><source type="image/webp" srcset="assets/gundam/faction_earth_alliance-480w.webp 480w, assets/gundam/faction_earth_alliance-960w.webp 960w, assets/gundam/faction_earth_alliance.webp 1440w" sizes="(max-width: 768px) 100vw, 900px"><img loading="lazy" decoding="async" width="900" height="320" src="assets/gundam/faction_earth_alliance.jpg" class="w-full h-80 object-cover" alt="地球联合军 Earth Alliance"></picture>
                        <div class="p-10">
                            <div class="text-[#0033A0] text-sm tracking-[3px]">EARTH ALLIANCE</div>
                            <div class="text-5xl font-bold tracking-tight mt-1 mb-6">地球联合军</div>
                            
                            <div class="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-white/85">
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">组织概况</div>
                                    <p>由大西洋联邦、欧亚联邦、东亚共和国等国家组成的自然人（Naturals）军事联盟。是SEED时代对抗ZAFT的主要势力。</p>
                                </div>
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">关键人物</div>
                                    <p>穆·拉·弗拉加、娜塔尔·巴达吉露、穆拉塔·阿兹拉等。</p>
                                    <div class="mt-4 text-[#C5A26E] text-xs tracking-widest mb-2">代表机体</div>
                                    <p>GAT-X105 Strike、GAT-X303 Aegis、GAT-X207 Blitz等第一阶段GAT-X系列。</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (faction === 'orb') {
                inner = `
                    <div class="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                                class="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-3xl text-white/60 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition">×</button>
                        <picture><source type="image/webp" srcset="assets/gundam/faction_orb-480w.webp 480w, assets/gundam/faction_orb-960w.webp 960w, assets/gundam/faction_orb.webp 1440w" sizes="(max-width: 768px) 100vw, 900px"><img loading="lazy" decoding="async" width="900" height="320" src="assets/gundam/faction_orb.jpg" class="w-full h-80 object-cover" alt="奥布联合首长国 Orb Union"></picture>
                        <div class="p-10">
                            <div class="text-[#C5A26E] text-sm tracking-[3px]">ORB UNION</div>
                            <div class="text-5xl font-bold tracking-tight mt-1 mb-6">奥布联合首长国</div>
                            
                            <div class="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-white/85">
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">组织概况</div>
                                    <p>中立国家，由雅兰·阿斯哈家族统治。以“永不参与战争”为国策，但实际在SEED中多次被卷入战争。</p>
                                    <p class="mt-3">拥有世界最顶尖的军事科技，开发了M1 Astray等先进MS。</p>
                                </div>
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">关键人物</div>
                                    <p>卡嘉莉·尤拉·阿斯哈、雅兰·阿斯哈、穆·拉·弗拉加等。</p>
                                    <div class="mt-4 text-[#C5A26E] text-xs tracking-widest mb-2">代表机体</div>
                                    <p>M1 Astray、MVF-X08 Eclipse Gundam等。</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (faction === 'plant') {
                inner = `
                    <div class="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                                class="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-3xl text-white/60 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition">×</button>
                        <picture><source type="image/webp" srcset="assets/gundam/faction_plant-480w.webp 480w, assets/gundam/faction_plant-960w.webp 960w, assets/gundam/faction_plant.webp 1440w" sizes="(max-width: 768px) 100vw, 900px"><img loading="lazy" decoding="async" width="900" height="320" src="assets/gundam/faction_plant.jpg" class="w-full h-80 object-cover" alt="PLANT 太空殖民地"></picture>
                        <div class="p-10">
                            <div class="text-red-400 text-sm tracking-[3px]">PLANT</div>
                            <div class="text-5xl font-bold tracking-tight mt-1 mb-6">太空殖民地</div>
                            
                            <div class="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-white/85">
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">组织概况</div>
                                    <p>协调者（Coordinator）在L5拉格朗日点建立的10个大型太空殖民地群，是ZAFT的政治母体。</p>
                                </div>
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">政治地位</div>
                                    <p>由最高评议会领导，ZAFT是其武装力量。在SEED Destiny中，杜兰达尔担任主席。</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (faction === 'blue_cosmos') {
                inner = `
                    <div class="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                                class="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-3xl text-white/60 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition">×</button>
                        <picture><source type="image/webp" srcset="assets/gundam/faction_blue_cosmos-480w.webp 480w, assets/gundam/faction_blue_cosmos-960w.webp 960w, assets/gundam/faction_blue_cosmos.webp 1440w" sizes="(max-width: 768px) 100vw, 900px"><img loading="lazy" decoding="async" width="900" height="320" src="assets/gundam/faction_blue_cosmos.jpg" class="w-full h-80 object-cover" alt="Blue Cosmos 反协调者组织"></picture>
                        <div class="p-10">
                            <div class="text-blue-400 text-sm tracking-[3px]">BLUE COSMOS / LOGOS</div>
                            <div class="text-5xl font-bold tracking-tight mt-1 mb-6">反协调者组织</div>
                            
                            <div class="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-white/85">
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">组织概况</div>
                                    <p>极端反协调者（Naturals优先主义）恐怖组织，主张“蓝色宇宙”（纯净自然人世界）。</p>
                                    <p class="mt-3">在SEED Destiny中演变为幕后黑手“LOGOS”，操纵世界战争。</p>
                                </div>
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">代表人物</div>
                                    <p>穆尔塔·阿兹拉、洛戈斯成员等。</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (faction === 'terminal') {
                inner = `
                    <div class="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                                class="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-3xl text-white/60 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition">×</button>
                        <picture><source type="image/webp" srcset="assets/gundam/faction_terminal-480w.webp 480w, assets/gundam/faction_terminal-960w.webp 960w, assets/gundam/faction_terminal.webp 1440w" sizes="(max-width: 768px) 100vw, 900px"><img loading="lazy" decoding="async" width="900" height="320" src="assets/gundam/faction_terminal.jpg" class="w-full h-80 object-cover" alt="终端 Terminal 秘密组织"></picture>
                        <div class="p-10">
                            <div class="text-[#C5A26E] text-sm tracking-[3px]">TERMINAL</div>
                            <div class="text-5xl font-bold tracking-tight mt-1 mb-6">终端</div>
                            
                            <div class="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-white/85">
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">组织概况</div>
                                    <p>拉克丝·克莱因在SEED Destiny时期秘密建立的地下组织，成员包括部分ZAFT军官和民间人士。</p>
                                </div>
                                <div>
                                    <div class="text-[#C5A26E] text-xs tracking-widest mb-2">主要目标</div>
                                    <p>揭露LOGOS的阴谋、阻止战争扩大、建立真正的和平。曾协助真·飞鸟等人。</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            modal.innerHTML = inner;
            document.body.appendChild(modal);
        };

        // ==================== 高达详情模态 (点击任意高达卡片弹出 - 档案馆核心功能) ====================
        window.showGundamDetail = function(id) {
            const data = gundamsData[id];
            if (!data) return;

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

            const specsHTML = Object.entries(data.specs || {}).map(([key, val]) => 
                `<div class="border border-white/10 rounded-xl px-4 py-3">
                    <div class="text-[10px] tracking-[2px] text-[#C5A26E]">${key.toUpperCase()}</div>
                    <div class="text-lg font-medium mt-0.5">${val}</div>
                </div>`
            ).join('');

            modal.innerHTML = `
                <div class="relative max-w-5xl w-full bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <!-- Close Button -->
                    <button onclick="event.stopImmediatePropagation(); this.closest('.fixed').remove()" 
                            class="absolute top-5 right-5 z-20 w-11 h-11 flex items-center justify-center text-4xl text-white/50 hover:text-white bg-black/70 hover:bg-black/90 rounded-full transition">×</button>

                    <!-- Hero Image -->
                    <div class="relative h-80 md:h-[420px]">
                        <img src="${webpSrc(data.image)}" data-jpg="${data.image}" onerror="if(this.src.indexOf('.webp')>-1){this.src=this.dataset.jpg;}else{this.onerror=null;this.src='assets/gundam/strike-freedom-gundam.jpg';}"
                             decoding="async" width="900" height="420"
                             class="w-full h-full object-cover" alt="${data.nameCn ? data.nameCn + ' ' + (data.name || '') : (data.name || '机动战士')}">
                        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/90"></div>
                        
                        <!-- Model & Name Overlay -->
                        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="px-3 py-1 text-xs tracking-[3px] border border-white/40 rounded-full text-white/80">${data.model}</div>
                                <div class="px-3 py-1 text-xs tracking-[3px] bg-[#C5A26E] text-black font-semibold rounded-full">${data.type}</div>
                            </div>
                            <div class="text-5xl md:text-6xl font-bold tracking-[-2.5px] text-white">${data.nameCn}</div>
                            <div class="text-2xl text-[#C5A26E] tracking-tight -mt-1">${data.name}</div>
                        </div>
                    </div>

                    <div class="p-8 md:p-10 grid md:grid-cols-5 gap-8 text-[15px]">
                        <!-- Left Info -->
                        <div class="md:col-span-3 space-y-8">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-2">PILOT / FACTION</div>
                                <div class="text-2xl font-semibold">${data.pilot}</div>
                                <div class="text-white/60">${data.faction}</div>
                            </div>

                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-3">ARCHIVE ENTRY</div>
                                <p class="leading-relaxed text-white/85">${data.intro}</p>
                            </div>

                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-3">DIRECTOR'S NOTE — CHRISTOPHER NOLAN</div>
                                <div class="pl-4 border-l-2 border-[#C5A26E]/60 italic text-white/80 leading-snug">
                                    “${data.cinematic || '命运的齿轮仍在转动……'}”
                                </div>
                            </div>
                        </div>

                        <!-- Right Specs + Actions -->
                        <div class="md:col-span-2 space-y-6">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[3px] mb-3">TECHNICAL SPECIFICATIONS</div>
                                <div class="grid grid-cols-2 gap-3 text-sm">
                                    ${specsHTML}
                                </div>
                            </div>

                            <div class="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                                <button onclick="this.closest('.fixed').remove(); document.getElementById('pilots').scrollIntoView({behavior:'smooth'})" 
                                        class="flex-1 px-5 py-3 border border-white/20 hover:bg-white/5 rounded-2xl text-sm tracking-widest transition">
                                    VIEW PILOT PROFILE
                                </button>
                                <button onclick="this.closest('.fixed').remove()" 
                                        class="px-8 py-3 bg-[#C5A26E] hover:bg-white text-black font-semibold tracking-widest rounded-2xl text-sm transition">
                                    CLOSE ARCHIVE
                                </button>
                            </div>

                            <div class="text-[10px] text-white/40 tracking-[1px]">COSMIC ERA • MOBILE SUIT ARCHIVE • CLASSIFIED LEVEL 5</div>
                        </div>
                    </div>

                    <!-- New interactive feature: Fate Summary (poetic archive immersion) -->
                    <div class="px-8 pb-6">
                        <button onclick="generateFateSummary(this)" 
                                class="w-full py-2 text-xs tracking-[2px] border border-white/20 hover:bg-white/5 rounded-2xl flex items-center justify-center gap-2">
                            <i class="fa-solid fa-scroll"></i>
                            <span>生成命运摘要 (Nolan风格诗意报告)</span>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Cinematic GSAP entrance for the archive card itself (Nolan weight + fate reveal)
            if (window.gsap) {
                const card = modal.querySelector('.max-w-5xl');
                if (card) {
                    gsap.fromTo(card, 
                        { opacity: 0, y: 36, scale: 0.985 }, 
                        { opacity: 1, y: 0, scale: 1, duration: 0.58, ease: "power2.out" }
                    );
                }
            }
        };

        // ==================== 诺兰随机洞察 (Random Director's Note) ====================
        window.showRandomCinematicNote = function() {
            const keys = Object.keys(gundamsData);
            if (!keys.length) return;

            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const data = gundamsData[randomKey];

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

            // Nolan-style subtle vignette flash on archive opening
            const flash = document.createElement('div');
            flash.className = 'absolute inset-0 pointer-events-none random-note-vignette';
            flash.style.opacity = '0';
            modal.appendChild(flash);

            // Extra cinematic touch: very subtle film grain layer that fades in
            const grain = document.createElement('div');
            grain.className = 'absolute inset-0 pointer-events-none';
            grain.style.backgroundImage = 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 3px)';
            grain.style.opacity = '0';
            modal.appendChild(grain);
            
            if (window.gsap) {
                gsap.to(flash, { 
                    opacity: 0.85, 
                    duration: 0.12, 
                    ease: "power1.in",
                    onComplete: () => {
                        gsap.to(flash, { opacity: 0, duration: 1.6, ease: "power2.out" });
                    }
                });

                // Nolan poetic quote reveal: slow, weighted, with micro blur for tension
                const quote = modal.querySelector('.cinematic-reveal');
                if (quote) {
                    gsap.fromTo(quote, 
                        { opacity: 0, y: 14, filter: "blur(2px)" },
                        { 
                            opacity: 1, 
                            y: 0, 
                            filter: "blur(0px)", 
                            duration: 1.25, 
                            ease: "power2.out",
                            delay: 0.32
                        }
                    );
                }
            }

            modal.innerHTML = `
                <div class="max-w-2xl w-full bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/10 relative">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="absolute top-5 right-5 text-3xl text-white/40 hover:text-white z-10">×</button>
                    
                    <div class="p-10">
                        <div class="text-[#C5A26E] text-xs tracking-[4px] mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-film"></i>
                            <span>DIRECTED BY CHRISTOPHER NOLAN</span>
                        </div>
                        
                        <div class="text-3xl font-bold tracking-tight mb-6">${data.nameCn} — 随机洞察</div>
                        
                        <div class="text-[17px] leading-relaxed text-white/90 italic border-l-2 border-[#C5A26E] pl-6 cinematic-reveal">
                            “${data.cinematic || '命运的齿轮仍在转动……'}”
                        </div>
                        
                        <div class="mt-8 flex items-center justify-between text-xs">
                            <div class="text-white/50">${data.model} · ${data.pilot}</div>
                            <button onclick="showGundamDetail('${data.id}'); this.closest('.fixed').remove();" 
                                    class="px-6 py-2 border border-[#C5A26E] text-[#C5A26E] rounded-2xl hover:bg-[#C5A26E] hover:text-black transition">
                                查看该高达档案
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Subtle GSAP entrance if available
            if (window.gsap) {
                const content = modal.querySelector('.max-w-2xl');
                gsap.fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
            }
        };

        // ==================== 命运抽选 (Surprise Me) - 诺兰式随机探索功能 ====================
        window.surpriseMeGundam = function() {
            const keys = Object.keys(gundamsData);
            if (!keys.length) return;

            // 真正的“命运”感觉：带一点随机权重（优先显示还没收藏的）
            const notFavorited = keys.filter(k => !window.favorites.gundams.includes(k));
            const pool = notFavorited.length > 2 ? notFavorited : keys;

            const randomId = pool[Math.floor(Math.random() * pool.length)];
            const data = gundamsData[randomId];

            // 先关闭可能存在的筛选模态
            const existingModals = document.querySelectorAll('.fixed.inset-0');
            existingModals.forEach(m => m.remove());

            // 优雅延迟打开详情（营造“命运降临”的仪式感）
            setTimeout(() => {
                showGundamDetail(randomId);

                // 额外：短暂高亮提示这是命运的选择
                setTimeout(() => {
                    const modal = document.querySelector('.fixed.inset-0:last-child');
                    if (modal) {
                        const banner = document.createElement('div');
                        banner.className = 'absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-xs tracking-[3px] bg-[#C8102E] text-white rounded-full flex items-center gap-2 shadow-lg';
                        banner.innerHTML = `<i class="fa-solid fa-dice"></i> <span>命运选择了你</span>`;
                        modal.querySelector('.max-w-5xl')?.appendChild(banner);

                        setTimeout(() => banner.remove(), 2200);
                    }
                }, 420);
            }, 180);
        };

        // ==================== 移动端导航菜单 ====================
        window.showMobileNav = function() {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[400] flex flex-col';
            
            modal.innerHTML = `
                <div class="flex justify-between items-center px-6 h-16 border-b border-white/10">
                    <div class="flex items-center gap-3">
                        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#C8102E] to-[#C5A26E]"></div>
                        <div class="font-semibold">GUNDAM SEED</div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-3xl text-white/50">×</button>
                </div>
                
                <div class="flex-1 px-6 py-8 space-y-1 text-lg">
                    <a href="#gundams" onclick="this.closest('.fixed').remove()" class="block py-4 border-b border-white/10 hover:text-[#C5A26E]">高达 Mobile Suits</a>
                    <a href="#factions" onclick="this.closest('.fixed').remove()" class="block py-4 border-b border-white/10 hover:text-[#C5A26E]">主要势力 Factions</a>
                    <a href="#pilots" onclick="this.closest('.fixed').remove()" class="block py-4 border-b border-white/10 hover:text-[#C5A26E]">驾驶员 Pilots</a>
                    <a href="#relationships" onclick="this.closest('.fixed').remove()" class="block py-4 border-b border-white/10 hover:text-[#C5A26E]">人物关系</a>
                    <a href="#gallery" onclick="this.closest('.fixed').remove()" class="block py-4 border-b border-white/10 hover:text-[#C5A26E]">角色画廊</a>
                    
                    <div class="pt-6 space-y-3">
                        <button onclick="this.closest('.fixed').remove(); showMyArchive()" 
                                class="w-full flex items-center justify-center gap-2 py-4 bg-[#C5A26E] text-black font-semibold tracking-widest rounded-2xl">
                            <i class="fa-solid fa-heart"></i>
                            <span>MY ARCHIVE 我的档案</span>
                        </button>
                        
                        <button onclick="this.closest('.fixed').remove(); showRandomCinematicNote()" 
                                class="w-full flex items-center justify-center gap-2 py-3 border border-white/20 text-sm tracking-widest rounded-2xl hover:bg-white/5">
                            <i class="fa-solid fa-film"></i>
                            <span>诺兰随机洞察</span>
                        </button>

                        <!-- New delightful quick fate action -->
                        <button onclick="this.closest('.fixed').remove(); if(window.surpriseMeGundam) window.surpriseMeGundam();" 
                                class="w-full flex items-center justify-center gap-2 py-3 border border-[#C8102E]/40 text-sm tracking-widest rounded-2xl hover:bg-[#C8102E]/10 text-[#C8102E]">
                            <i class="fa-solid fa-dice"></i>
                            <span>命运抽选 (R)</span>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 text-center text-xs text-white/40 border-t border-white/10">COSMIC ERA 71-73 • MOBILE ARCHIVE</div>
            `;
            document.body.appendChild(modal);

            // Cinematic GSAP entrance for mobile menu (Nolan weight)
            if (window.gsap) {
                gsap.fromTo(modal, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            }
        };

        // ==================== 恋爱动态漫播放器 + 中文配音 + 舒缓钢琴背景音乐 ====================
        window.playRomanceComic = function(couple) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';

            let videoSrc = "";
            let poster = "";
            let title = "";
            let desc = "";

            if (couple === 'kira-lacus') {
                title = "基拉 & 拉克丝 · 战后小岛的永恒约定";
                videoSrc = "assets/videos/romance/kira_lacus_romance_dynamic.mp4";
                poster = "assets/gundam/kira-lacus-romance1.jpg";
                desc = "战后小岛，永恒的温柔约定。";
            } else if (couple === 'athrun-cagalli') {
                title = "阿斯兰 & 卡嘉莉 · 驾驶舱里的心跳";
                videoSrc = "assets/videos/romance/athrun_cagalli_romance_dynamic.mp4";
                poster = "assets/gundam/athrun-cagalli-romance.jpg";
                desc = "炮火中的心跳与守护。";
            } else if (couple === 'shinn-lunamaria') {
                title = "真 & 露娜玛丽亚 · 殖民地的温柔夜晚";
                videoSrc = "assets/videos/romance/shinn_lunamaria_romance_dynamic.mp4";
                poster = "assets/gundam/shinn-lunamaria-romance.jpg";
                desc = "从仇恨到爱的温柔治愈。";
            }

            modal.innerHTML = `
                <div class="max-w-4xl w-full bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/10">
                    <div class="px-8 py-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <div class="text-[#C5A26E] text-xs tracking-[3px]">DYNAMIC ROMANCE VIDEO • 中文配音</div>
                            <div class="text-2xl font-bold">${title}</div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="text-3xl text-white/30 hover:text-white">×</button>
                    </div>

                    <div class="relative bg-black">
                        <video id="romance-video" class="w-full aspect-video object-cover bg-black" poster="${poster}" controls playsinline>
                            <source src="${videoSrc}" type="video/mp4">
                            您的浏览器不支持视频播放。
                        </video>
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 text-sm text-white/90 pointer-events-none">
                            ${desc}
                        </div>
                    </div>

                    <div class="p-6 flex gap-4 items-center">
                        <button onclick="document.getElementById('romance-video').play()" 
                                class="flex-1 py-3 bg-[#C5A26E] text-black font-medium rounded-2xl hover:bg-white">
                            ▶ 播放视频（含中文配音）
                        </button>
                        <button onclick="document.getElementById('romance-video').pause(); this.closest('.fixed').remove()" 
                                class="px-8 py-3 border border-white/20 rounded-2xl">关闭</button>
                        <div class="text-xs text-white/40">甜甜女生中文配音 + 舒缓钢琴背景乐 · SEED正传情感</div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 打开后尝试自动播放（浏览器可能需要用户交互）
            setTimeout(() => {
                const vid = document.getElementById('romance-video');
                if (vid) {
                    vid.play().catch(() => { /* 等待用户点击播放按钮 */ });
                }
            }, 350);
        };

        window.onload = init;

        // ==================== 强袭自由高达封面 + 点击进入 ====================
        window.enterWebsite = function() {
            const overlay = document.getElementById('seed-entrance');
            if (!overlay) return;

            // Nolan cinematic cut: slow elegant dissolve with micro push (fate opening)
            if (window.gsap) {
                gsap.to(overlay, {
                    opacity: 0,
                    scale: 1.012,
                    duration: 1.35,
                    ease: "power2.inOut",
                    onComplete: () => {
                        overlay.style.display = 'none';
                        overlay.style.transform = '';
                    }
                });
            } else {
                overlay.style.transition = 'opacity 1.0s cubic-bezier(0.23,1,0.32,1), transform 1.35s cubic-bezier(0.23,1,0.32,1)';
                overlay.style.opacity = '0';
                overlay.style.transform = 'scale(1.012)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 1350);
            }
        };

        // ==================== 强袭自由高达 vs 正义高达 对战进场动画 (顶级设计师版) ====================
        function startSeedEntrance() {
            const overlay = document.getElementById('seed-entrance');
            const canvas = document.getElementById('battle-canvas');
            if (!canvas) return; // 元素不存在时安全退出
            const ctx = canvas.getContext('2d');
            const title = document.getElementById('seed-title');
            const subtitle = document.getElementById('seed-subtitle');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let time = 0;
            let particles = [];
            let beams = [];

            // 初始化爆炸粒子
            for (let i = 0; i < 180; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 4,
                    size: Math.random() * 2.5 + 0.8,
                    life: Math.random() * 80 + 40,
                    color: Math.random() > 0.6 ? '#C5A26E' : '#FF4500'
                });
            }

            function drawStrikeFreedom(x, y, scale, angle) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.scale(scale, scale);

                // 机身 (白色金色)
                ctx.fillStyle = '#F5F5F5';
                ctx.fillRect(-30, -15, 60, 30);
                
                // 头部
                ctx.fillStyle = '#222';
                ctx.fillRect(-8, -22, 16, 14);
                
                // 巨大金色翅膀 (DRAGOON)
                ctx.fillStyle = '#C5A26E';
                ctx.beginPath();
                ctx.moveTo(-25, 0);
                ctx.lineTo(-90, -55);
                ctx.lineTo(-70, 0);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(25, 0);
                ctx.lineTo(90, -55);
                ctx.lineTo(70, 0);
                ctx.fill();

                ctx.restore();
            }

            function drawJustice(x, y, scale, angle) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.scale(scale, scale);

                // 绿色机身
                ctx.fillStyle = '#2E8B57';
                ctx.fillRect(-28, -12, 56, 24);
                
                // 头部
                ctx.fillStyle = '#111';
                ctx.fillRect(-7, -18, 14, 12);

                // 正义高达标志性背包武器
                ctx.fillStyle = '#C5A26E';
                ctx.fillRect(-40, -8, 20, 6);
                ctx.fillRect(20, -8, 20, 6);

                ctx.restore();
            }

            function animate() {
                ctx.fillStyle = 'rgba(5,5,8,0.25)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2 + 40;

                // 背景太空星云
                ctx.fillStyle = '#11223311';
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(i * 180, 100 + Math.sin(time * 0.01 + i) * 30, 220, 180);
                }

                // 计算两机位置 (对战接近)
                const progress = Math.min(time / 220, 1);
                const sfX = centerX - 280 + progress * 140;
                const sfY = centerY - 30 + Math.sin(time * 0.04) * 18;
                const jX = centerX + 260 - progress * 140;
                const jY = centerY + 20 - Math.sin(time * 0.035) * 22;

                // 绘制两台高达
                const sfAngle = Math.sin(time * 0.03) * 0.12;
                const jAngle = Math.cos(time * 0.025) * -0.1;

                drawStrikeFreedom(sfX, sfY, 1.15, sfAngle);
                drawJustice(jX, jY, 1.1, jAngle);

                // 光束对轰
                if (time > 80 && time < 260) {
                    ctx.strokeStyle = time % 6 < 3 ? '#00BFFF' : '#FF4500';
                    ctx.lineWidth = 4 + Math.sin(time * 0.3) * 2;
                    ctx.beginPath();
                    ctx.moveTo(sfX + 50, sfY - 5);
                    ctx.lineTo(jX - 45, jY + 8);
                    ctx.stroke();

                    // 命中火花
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(jX - 50, jY - 12, 8, 8);
                }

                // 粒子系统 (爆炸与碎片)
                ctx.globalAlpha = 0.9;
                particles.forEach((p, i) => {
                    p.x += p.vx * (1 + Math.sin(time * 0.1) * 0.3);
                    p.y += p.vy;
                    p.life -= 1;
                    p.vy += 0.03;

                    if (p.life > 0) {
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, p.size, p.size * 0.7);
                    }
                });
                ctx.globalAlpha = 1;

                // 偶尔添加新爆炸粒子
                if (time % 3 === 0 && time < 280) {
                    particles.push({
                        x: centerX + (Math.random() - 0.5) * 380,
                        y: centerY + (Math.random() - 0.5) * 120,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 0.5) * 3 - 1,
                        size: Math.random() * 2 + 1,
                        life: 45 + Math.random() * 25,
                        color: Math.random() > 0.5 ? '#C5A26E' : '#FF4500'
                    });
                }

                // 清理死亡粒子
                particles = particles.filter(p => p.life > 0);

                time++;

                if (time < 320) {
                    requestAnimationFrame(animate);
                } else {
                    // 文字登场
                    gsap.to(title, { opacity: 1, duration: 0.9, ease: "power2.out" });
                    gsap.to(subtitle, { opacity: 1, duration: 0.9, delay: 0.35, ease: "power2.out" });

                    setTimeout(() => {
                        overlay.style.transition = 'opacity 1.6s cubic-bezier(0.23,1,0.32,1)';
                        overlay.style.opacity = '0';
                        setTimeout(() => overlay.style.display = 'none', 1700);
                    }, 2400);
                }
            }

            animate();
        }

        // 进场动画已停用：首屏直接铺满显示全部高达，不再播放入场遮罩动画
        // setTimeout(() => {
        //     startSeedEntrance();
        // }, 300);

        // ==================== 模拟视频播放 ====================
        function playBattleVideo(type) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';

            modal.innerHTML = `
                <div class="max-w-5xl w-full">
                    <div class="flex justify-between items-center mb-4 px-2">
                        <div>
                            <div class="text-sm text-[#C5A26E]">COSMIC ERA</div>
                            <div class="text-4xl font-bold">强袭自由高达 vs 正义高达</div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="text-4xl text-white/30 hover:text-white">×</button>
                    </div>
                    
                    <div class="bg-black rounded-2xl overflow-hidden border border-white/10" style="aspect-ratio: 16 / 9">
                        <canvas id="duel-canvas" class="w-full h-full"></canvas>
                    </div>
                    
                    <div class="text-center mt-4 text-xs text-white/50">真实模拟 · 光束对轰 · 近距离格斗</div>
                </div>
            `;
            document.body.appendChild(modal);

            // 启动高质量对战 Canvas 动画
            setTimeout(() => {
                const c = document.getElementById('duel-canvas');
                if (c) startDuelAnimation(c);
            }, 80);
        }

        function startDuelAnimation(canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            let t = 0;
            let fx = canvas.width * 0.28;
            let jx = canvas.width * 0.72;
            let fy = canvas.height * 0.45;
            let jy = canvas.height * 0.55;

            function loop() {
                ctx.fillStyle = '#05070f';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 星空
                ctx.fillStyle = '#fff';
                for (let i = 0; i < 45; i++) {
                    ctx.fillRect((i * 37) % canvas.width, (i * 19 + t * 0.3) % canvas.height, 1, 1);
                }

                // 绘制强袭自由 (左侧)
                ctx.save();
                ctx.translate(fx, fy);
                ctx.rotate(Math.sin(t * 0.04) * 0.08);
                ctx.fillStyle = '#F8F8F8';
                ctx.fillRect(-35, -12, 70, 24);
                ctx.fillStyle = '#C5A26E';
                ctx.fillRect(-55, -28, 22, 8);
                ctx.fillRect(35, -28, 22, 8);
                ctx.fillStyle = '#222';
                ctx.fillRect(-6, -20, 12, 10);
                ctx.restore();

                // 绘制正义 (右侧)
                ctx.save();
                ctx.translate(jx, jy);
                ctx.rotate(Math.cos(t * 0.035) * -0.07);
                ctx.fillStyle = '#2E8B57';
                ctx.fillRect(-32, -10, 64, 20);
                ctx.fillStyle = '#C5A26E';
                ctx.fillRect(-48, -6, 18, 5);
                ctx.fillRect(30, -6, 18, 5);
                ctx.fillStyle = '#111';
                ctx.fillRect(-5, -16, 10, 9);
                ctx.restore();

                // 光束对射
                if (t % 5 < 3) {
                    ctx.strokeStyle = '#00BFFF';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(fx + 38, fy - 3);
                    ctx.lineTo(jx - 38, jy + 4);
                    ctx.stroke();

                    ctx.strokeStyle = '#FF4500';
                    ctx.beginPath();
                    ctx.moveTo(jx - 38, jy - 2);
                    ctx.lineTo(fx + 38, fy + 5);
                    ctx.stroke();
                }

                // 爆炸粒子
                if (t % 4 === 0) {
                    for (let i = 0; i < 3; i++) {
                        ctx.fillStyle = Math.random() > 0.5 ? '#C5A26E' : '#FF4500';
                        ctx.fillRect(fx + Math.random() * 60 - 20, fy + Math.random() * 30 - 10, 3, 3);
                        ctx.fillRect(jx + Math.random() * 50 - 30, jy + Math.random() * 25 - 8, 3, 3);
                    }
                }

                t++;
                requestAnimationFrame(loop);
            }
            loop();
        }

        function playCoupleMovie(type) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6';

            if (type === 'kira-lacus') {
                // 基拉 & 拉克丝 · 《和平的歌》 甜蜜日常短片（模拟） - 完整交互版
                const scenes = [
                    {
                        img: 'assets/gundam/kira_lacus_sweet_song_01.jpg',
                        title: '清晨的歌声 · 第一幕',
                        day: 7,
                        desc: '战火平息后的第七天。小岛木屋的平台上，拉克丝穿着素净的白裙，粉色长发在海风中轻扬。她闭着眼睛，轻声哼唱着只属于基拉的旋律。歌声如晨露般纯净，唤醒了沉睡的爱人。'
                    },
                    {
                        img: 'assets/gundam/kira_lacus_guardian_sunset_02.jpg',
                        title: '海边守护 · 第二幕',
                        day: 7,
                        desc: '基拉站在礁石边缘，棕色短发被风吹乱。他没有说话，只是静静注视着远处唱歌的她。曾经的战士，如今只想用这双曾握着光束剑的手，守护她一生的笑容。'
                    },
                    {
                        img: 'assets/gundam/kira-lacus-beach.jpg',
                        title: '沙滩漫步 · 第三幕',
                        day: 8,
                        desc: '两人赤足走在细软的沙滩上。拉克丝偶尔停下，捡起一枚贝壳递给基拉。基拉低头轻笑，握紧她的手。海浪一遍遍冲刷脚踝，带走所有战争的痕迹。'
                    },
                    {
                        img: 'assets/gundam/lacus_singing.jpg',
                        title: '窗边的旋律 · 第四幕',
                        day: 9,
                        desc: '黄昏时分，拉克丝坐在小屋窗前，为归来的基拉唱起原作经典《水の証》。她的声音温柔而坚定，歌词里没有硝烟，只有「这是生命的证明」「我们在一起」。基拉靠在门框，眼中只有她。'
                    },
                    {
                        img: 'assets/gundam/kira-lacus-romance1.jpg',
                        title: '夕阳拥抱 · 第五幕',
                        day: 10,
                        desc: '太阳沉入海平面。基拉从身后轻轻环住拉克丝的腰，把下巴搁在她肩上。两人望着染成金红的海面，什么也不说。笑容在风里静静绽放，这就是他们赢来的全部和平。'
                    },
                    {
                        img: 'assets/gundam/lacus_kira_beach.jpg',
                        title: '星空许愿 · 第六幕',
                        day: 11,
                        desc: '夜里，两个人在沙滩上并肩躺下。拉克丝指着星星轻声说：「如果每一颗星星都是一次选择，我只想永远选择你。」基拉握紧她的手，许下无声的誓言：此生守护你的笑容，直到永远。'
                    }
                ];

                let currentIdx = 0;

                modal.innerHTML = `
                    <div class="max-w-5xl w-full bg-[#0F0F0F] rounded-3xl overflow-hidden border border-[#C5A26E]/40 shadow-2xl">
                        <!-- Header -->
                        <div class="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-[#111]">
                            <div>
                                <div class="text-[#C5A26E] text-xs tracking-[4px]">POST-WAR HEALING • SWEET DAILY SIM</div>
                                <div class="text-3xl font-bold text-white mt-1">基拉 & 拉克丝 · 《和平的歌》</div>
                                <div class="text-sm text-white/60 mt-0.5">战后小岛隐居 · 每天的歌声与守护 · 甜蜜日常短片（原作女主真实歌声音频）</div>
                            </div>
                            <button id="peace-close-x" class="text-4xl text-white/40 hover:text-[#C5A26E] leading-none transition">×</button>
                        </div>

                        <div class="p-8">
                            <div class="grid md:grid-cols-5 gap-6">
                                <!-- Visual Player -->
                                <div class="md:col-span-3">
                                    <div class="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-xl ring-1 ring-white/10">
                                        <img id="peace-img" src="assets/gundam/kira_lacus_sweet_song_01.webp"
                                             onerror="if(this.src.indexOf('.webp')>-1){this.src=this.src.replace('.webp','.jpg');}"
                                             decoding="async" width="1280" height="720"
                                             class="w-full h-full object-cover transition-all duration-700" alt="和平的歌 模拟画面">
                                        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                                            <div id="peace-scene-title" class="text-[#C5A26E] text-sm tracking-[3px] font-medium">清晨的歌声 · 第一幕</div>
                                            <div class="text-white/60 text-xs mt-1">小岛生活 · 第 <span id="peace-day">07</span> 天</div>
                                        </div>
                                        <div class="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-[10px] text-white/70 tracking-widest">AI SIM</div>
                                    </div>
                                    <div class="flex justify-center gap-1 mt-3">
                                        ${scenes.map((_,i)=>`<span class="peace-dot w-1.5 h-1.5 rounded-full bg-white/30 inline-block transition" data-idx="${i}"></span>`).join('')}
                                    </div>
                                </div>

                                <!-- Narrative + Controls -->
                                <div class="md:col-span-2 flex flex-col">
                                    <div class="text-[#C5A26E] text-xs tracking-[2px]">NARRATIVE SIMULATION</div>
                                    <div id="peace-desc" class="mt-4 text-white/90 leading-relaxed text-[15px] flex-1">
                                        战火平息后的第七天。小岛木屋的平台上，拉克丝穿着素净的白裙，粉色长发在海风中轻扬。她闭着眼睛，轻声哼唱着只属于基拉的旋律。歌声如晨露般纯净，唤醒了沉睡的爱人。
                                    </div>

                                    <div class="mt-6 space-y-3">
                                        <button id="peace-generate-btn"
                                                class="w-full px-6 py-3.5 bg-[#C5A26E] hover:bg-[#E8D4A8] active:bg-[#B38B4D] transition text-black font-medium rounded-2xl text-sm tracking-wide flex items-center justify-center gap-2">
                                            <span>生成下一刻</span>
                                            <span class="text-xs opacity-70">→</span>
                                        </button>
                                        <div id="peace-now-playing" class="text-[10px] text-[#C5A26E] font-medium tracking-wider mb-1.5">♪ 原作真实音频已就位：田中理恵 - 《水の証》</div>
                                        <div class="grid grid-cols-2 gap-3">
                                            <button id="peace-sing-btn"
                                                    class="px-5 py-3 border border-[#C5A26E]/70 hover:bg-[#C5A26E]/10 text-[#C5A26E] rounded-2xl text-sm transition flex items-center justify-center gap-2">
                                                <i class="fa-solid fa-music"></i>
                                                <span>播放原作歌声</span>
                                            </button>
                                            <button id="peace-close-btn"
                                                    class="px-5 py-3 border border-white/30 hover:bg-white/5 rounded-2xl text-sm transition">
                                                关闭
                                            </button>
                                        </div>
                                    </div>
                                    <div class="mt-4 text-[10px] text-white/40 leading-tight">
                                        「生成」推进日常 • 「播放原作歌声」直接播放真实SEED女主音频（当前《水の証》已就位，其余未放置则TTS回退）<br>
                                        纯甜蜜治愈向 · 与极致版完全独立
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-8 py-3 border-t border-white/10 bg-black/40 text-center text-[10px] text-white/40 tracking-widest">
                            基拉守护她的笑容 • 拉克丝每天为他唱《水の証》（田中理恵原唱） • 小岛上的永恒日常（已接入真实原作音频）
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                // Wire interactive simulation (closure scope)
                const imgEl = modal.querySelector('#peace-img');
                const titleEl = modal.querySelector('#peace-scene-title');
                const descEl = modal.querySelector('#peace-desc');
                const dayEl = modal.querySelector('#peace-day');
                const dots = modal.querySelectorAll('.peace-dot');

                function renderScene(idx) {
                    const s = scenes[idx];
                    imgEl.src = webpSrc(s.img);
                    titleEl.textContent = s.title;
                    descEl.textContent = s.desc;
                    dayEl.textContent = String(s.day).padStart(2, '0');
                    dots.forEach((d, i) => {
                        d.classList.toggle('bg-[#C5A26E]', i === idx);
                        d.classList.toggle('bg-white/30', i !== idx);
                    });
                }

                // Generate next scene
                modal.querySelector('#peace-generate-btn').onclick = () => {
                    currentIdx = (currentIdx + 1) % scenes.length;
                    renderScene(currentIdx);
                };

                // 直接使用原作高达SEED女主歌声音频（田中理恵 - 水の証 已放入）
                // 优先使用 assets/audio/lacus/ 下的真实MP3；未放置则回退到TTS
                let songIdx = 0;
                let currentAudio = null;

                const canonSongs = [
                    {
                        name: '水の証',
                        subtitle: '原作SEED · 和平的证明',
                        file: 'mizu_no_akashi.mp3',
                        lyrics: '这水……是谁的证明……\n是生命……是希望……的证明……\n战争的尽头……只剩这清澈的歌声……\n基拉……听我唱……\n直到永远……没有硝烟的明天……'
                    },
                    {
                        name: '静かな夜に',
                        subtitle: '原作SEED · 宁静的夜晚',
                        file: 'shizukana_yoru_ni.mp3',
                        lyrics: '在安静的夜晚……\n只有海风与你……\n炮火已远去……\n我只想为你……轻轻唱着……\n基拉……我们终于……可以这样……度过每一个夜晚……'
                    },
                    {
                        name: 'Fields of Hope',
                        subtitle: '原作SEED · 希望的原野',
                        file: 'fields_of_hope.mp3',
                        lyrics: '希望的原野……在远方等待……\n你的笑容……就是我的歌声……\n无论过去多么痛苦……\n此刻……只有爱与和平……\n基拉……守护着你……直到星辰陨落……'
                    }
                ];

                const nowPlayingEl = modal.querySelector('#peace-now-playing');

                function updateNowPlaying(status = '') {
                    const s = canonSongs[songIdx % canonSongs.length];
                    let html = `♪ 拉克丝 — 《${s.name}》`;
                    if (status) html += ` <span class="text-[#C5A26E]/70">(${status})</span>`;
                    else html += ` <span class="opacity-60">（原作SEED女主歌声）</span>`;
                    nowPlayingEl.innerHTML = html;
                }
                updateNowPlaying('田中理恵原唱《水の証》已就位');

                function stopCurrentAudio() {
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio = null;
                    }
                    speechSynthesis.cancel();
                }

                modal.querySelector('#peace-sing-btn').onclick = () => {
                    const song = canonSongs[songIdx % canonSongs.length];
                    stopCurrentAudio();

                    const audioPath = `assets/audio/lacus/${song.file}`;
                    const audio = new Audio(audioPath);

                    audio.onplay = () => {
                        updateNowPlaying('原作音频播放中');
                    };
                    audio.onended = () => {
                        updateNowPlaying('已播放完毕');
                        currentAudio = null;
                        // 自动切到下一首
                        songIdx = (songIdx + 1) % canonSongs.length;
                        updateNowPlaying('等待播放');
                    };
                    audio.onerror = () => {
                        // 真实音频不存在 → 回退到TTS模拟
                        currentAudio = null;
                        updateNowPlaying('未找到音频，使用TTS模拟');

                        const utterance = new SpeechSynthesisUtterance(song.lyrics);
                        utterance.lang = 'zh-CN';
                        utterance.rate = 0.68;
                        utterance.pitch = 1.32;
                        utterance.volume = 0.92;

                        const voices = speechSynthesis.getVoices();
                        const softVoice = voices.find(v =>
                            v.lang.includes('zh') &&
                            (v.name.includes('女') || v.name.toLowerCase().includes('female') ||
                             v.name.includes('Xiaoxiao') || v.name.includes('Yunxi') || v.name.includes('Hui'))
                        );
                        if (softVoice) utterance.voice = softVoice;

                        speechSynthesis.speak(utterance);

                        // 切换下一首
                        songIdx = (songIdx + 1) % canonSongs.length;
                        setTimeout(() => updateNowPlaying('TTS模拟（请放入原作MP3）'), 1200);
                    };

                    currentAudio = audio;
                    audio.play().catch(() => {
                        // 某些浏览器自动播放限制时也会触发
                        audio.onerror();
                    });
                };

                // Close handlers
                modal.querySelector('#peace-close-x').onclick = () => modal.remove();
                modal.querySelector('#peace-close-btn').onclick = () => modal.remove();

                // Click dots to jump scenes
                dots.forEach((dot, i) => {
                    dot.onclick = () => {
                        currentIdx = i;
                        renderScene(currentIdx);
                    };
                });

                // Init first scene
                renderScene(0);
            } else {
                // 其他情侣保持简洁（未来可扩展）
                const html = `<div><div class="text-3xl mb-4">阿斯兰 & 卡嘉莉 · 《奥布的黄昏》</div><div class="text-white/70">两人共同重建奥布，在夕阳下相拥的爱情故事短片（模拟）</div></div>`;
                modal.innerHTML = `
                    <div class="max-w-md w-full bg-[#111] p-8 rounded-3xl border border-white/10">
                        ${html}
                        <div class="mt-8 text-center">
                            <button onclick="this.closest('.fixed').remove()" class="px-8 py-3 text-sm border border-white/30 rounded-2xl">关闭</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
        }

        // ==================== 极致情侣影片交互播放器 (ITER10 新增) ====================
        function showCoupleLogTab(index) {
            document.querySelectorAll('.extreme-tab-content').forEach((el, i) => {
                el.classList.toggle('hidden', i !== index);
            });
            document.querySelectorAll('.extreme-tab').forEach((el, i) => {
                if (i === index) {
                    el.classList.add('border-b-2', 'border-[#C5A26E]', 'text-[#C5A26E]');
                    el.classList.remove('text-white/60');
                } else {
                    el.classList.remove('border-b-2', 'border-[#C5A26E]', 'text-[#C5A26E]');
                    el.classList.add('text-white/60');
                }
            });
        }

        function playVoiceScript(couple) {
            const scripts = {
                'kira': `战后的小岛上，基拉终于放下所有重量。每天清晨，拉克丝的歌声像阳光一样洒进房间。她轻轻说：今天的海风好温柔。基拉安静地笑着回答：只要有你在，每一天都是我曾经拼死守护的和平。诺兰式的缓慢镜头，捕捉两人相视而笑的瞬间。`,
                'athrun': `重建后的奥布，黄昏的街道上，阿斯兰与卡嘉莉并肩走着。卡嘉莉开朗地说：今天我想做你喜欢的菜！阿斯兰温柔地揉着她的头发，轻声回答：好啊，只要和你在一起，哪怕只是普通的黄昏，也比任何战场都值得。时间在落日余晖中慢慢延展。`,
                'shinn': `曾经被仇恨支配的少年，现在学会了温柔。露娜玛丽亚靠在真肩上笑着说：你笑起来的样子，比任何高达都帅。真愣了一下，然后难得地害羞地笑：笨蛋，那我以后就多笑给你看好了。诺兰式静默长镜头里，两个灵魂第一次感受到——活着，真好。`
            };

            const text = scripts[couple] || scripts['kira'];
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.85;
            utterance.pitch = 1.05;

            const voices = speechSynthesis.getVoices();
            const warmVoice = voices.find(v => v.lang.includes('zh') && (v.name.includes('女') || v.name.toLowerCase().includes('female')));
            if (warmVoice) utterance.voice = warmVoice;

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        }

        // 播放原作真实《水の証》音频（田中理恵）
        window.playRealLacusSong = function() {
            const audio = new Audio('assets/audio/lacus/mizu_no_akashi.mp3');
            audio.play().catch(() => {
                alert('真实音频文件未找到或无法播放。请确认 assets/audio/lacus/mizu_no_akashi.mp3 已正确放置。');
            });
        }

        // Initialize first tab as active
        setTimeout(() => {
            const firstTab = document.querySelector('.extreme-tab');
            if (firstTab) firstTab.classList.add('border-b-2', 'border-[#C5A26E]', 'text-[#C5A26E]');
        }, 100);

        // ==================== 基拉 & 拉克丝 极致导演剪辑版 (用户指定生成) ====================
        window.playExtremeKiraLacus = function() {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-6';

            modal.innerHTML = `
                <div class="max-w-5xl w-full bg-[#0A0A0A] rounded-3xl overflow-hidden border border-[#C8102E]/40 shadow-2xl">
                    <div class="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                        <div>
                            <div class="text-[#C8102E] text-xs tracking-[4px]">EXTREME DIRECTOR'S CUT • NOLAN × FIFTY SHADES</div>
                            <div class="text-3xl font-bold text-white">基拉 & 拉克丝 · 《和平的歌》极致导演剪辑版</div>
                            <div class="text-sm text-white/60 mt-1">战后小岛 · 歌声与欲望的极致交织（与甜蜜版完全独立）· 专业配音</div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="text-4xl text-white/40 hover:text-white leading-none">×</button>
                    </div>

                    <div class="p-8 grid md:grid-cols-2 gap-8">
                        <!-- Video -->
                        <div>
                            <video controls class="w-full rounded-2xl shadow-xl" poster="assets/gundam/kira-lacus-beach.jpg">
                                <source src="assets/videos/extreme/kira_lacus_zero_g_04.mp4" type="video/mp4">
                            </video>
                            <div class="mt-3 text-xs text-white/50 text-center">AI生成概念短片 · 零重力中的歌声与极致缠绵</div>
                        </div>

                        <!-- Extreme Description + Script -->
                        <div class="space-y-6">
                            <div>
                                <div class="text-[#C8102E] text-sm tracking-widest">THE FILM</div>
                                <div class="text-white/90 leading-relaxed mt-2">
                                    战后，小岛上时间仿佛停止。<br>
                                    拉克丝每天在海边为基拉唱歌，那歌声不再只是治愈，而是带着湿润的诱惑与深沉的欲望。<br>
                                    基拉在守护她的同时，逐渐被她的声音、她的身体、她的每一寸肌肤彻底征服。<br>
                                    在夕阳与星空交替的小屋里，他们的结合从温柔的依偎，演变为近乎疯狂、极致缠绵的肉体与灵魂的碰撞。<br>
                                    诺兰式的记忆碎片（战场的炮火与现在的喘息交错），五十度灰式的感官极致——汗水、泪水、歌声与低吟在零重力般的忘我中融为一体。
                                </div>
                            </div>

                            <div>
                                <div class="text-[#C8102E] text-sm tracking-widest mb-2">完整专业配音脚本（可播放）</div>
                                <div class="bg-black/60 p-4 rounded-xl text-sm text-white/90 leading-relaxed" id="kira-script-text">
                                    拉克丝（轻柔却充满诱惑的歌声渐渐转为低哑的呻吟）：<br>
                                    「基拉……今天这首歌……是为你唱的……哈啊……你的手……好热……」<br><br>
                                    基拉（低沉沙哑，带着战后疲惫与强烈占有欲）：<br>
                                    「拉克丝……你的声音……让我忘掉所有杀戮……继续唱……我要在你里面听你唱……」<br><br>
                                    （湿润的亲吻声、身体摩擦声、拉克丝越来越急促的喘息与歌声碎片）<br>
                                    拉克丝（高潮边缘，声音破碎）：<br>
                                    「基拉……我……我唱不下去了……啊——！……太深了……你的……」<br><br>
                                    基拉（低吼，极致温柔中带着粗暴）：<br>
                                    「那就别唱了……用你的身体……为我唱最后的和平……」
                                </div>
                                <button onclick="playKiraExtremeVoice()" class="mt-3 w-full py-2.5 bg-[#C8102E] hover:bg-red-700 text-white text-sm rounded-2xl transition font-medium">
                                    ▶ 播放极致专业配音（浏览器语音合成）
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="px-8 py-4 border-t border-white/10 text-[10px] text-white/40 text-center">
                        此为《原型·欲望驾驶舱》概念极致导演剪辑版 · 仅限艺术与成人欣赏
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        };

        window.playKiraExtremeVoice = function() {
            const text = document.getElementById('kira-script-text').innerText;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.88;
            utterance.pitch = 1.12;

            const voices = speechSynthesis.getVoices();
            const preferred = voices.find(v => v.lang.includes('zh') && (v.name.includes('女') || v.name.toLowerCase().includes('female') || v.name.includes('Xiaoxiao')));
            if (preferred) utterance.voice = preferred;

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        };

        // ==================== Round 1: 舰桥通讯弹幕 + 收藏这一刻 (纯 SEED 风格) ====================
        window.seedDanmaku = {
            'kira': JSON.parse(localStorage.getItem('seedDanmaku_kira') || '[]'),
            'athrun': JSON.parse(localStorage.getItem('seedDanmaku_athrun') || '[]'),
            'shinn': JSON.parse(localStorage.getItem('seedDanmaku_shinn') || '[]')
        };

        window.renderDanmaku = function(coupleKey, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const list = window.seedDanmaku[coupleKey] || [];
            container.innerHTML = list.map(d => 
                `<div class="seed-danmaku-item ${d.faction || ''}">${d.text}</div>`
            ).join('');
            container.scrollTop = container.scrollHeight;
        };

        window.sendDanmaku = function(coupleKey, inputId, listId) {
            const input = document.getElementById(inputId);
            if (!input || !input.value.trim()) return;

            const text = input.value.trim();
            const faction = ['zaft','orb','terminal'][Math.floor(Math.random()*3)];

            if (!window.seedDanmaku[coupleKey]) window.seedDanmaku[coupleKey] = [];
            window.seedDanmaku[coupleKey].push({ text, faction, t: Date.now() });

            // 限制数量
            if (window.seedDanmaku[coupleKey].length > 35) {
                window.seedDanmaku[coupleKey].shift();
            }

            localStorage.setItem('seedDanmaku_' + coupleKey, JSON.stringify(window.seedDanmaku[coupleKey]));
            window.renderDanmaku(coupleKey, listId);
            input.value = '';
        };

        window.saveVideoMoment = function(coupleKey, videoId, note) {
            const video = document.getElementById(videoId);
            if (!video) return;

            const time = Math.floor(video.currentTime);
            const moment = {
                id: 'moment_' + Date.now(),
                couple: coupleKey,
                time: time,
                note: note || '战后日常中的一瞬',
                t: Date.now()
            };

            if (!window.favorites.videoMoments) window.favorites.videoMoments = [];
            window.favorites.videoMoments.push(moment);
            window.saveFavorites();

            alert(`已收藏这一刻（${time}秒）到你的 Terminal 档案`);
            // 可选：自动打开 MY ARCHIVE
            // setTimeout(() => window.showMyArchive(), 400);
        };

        // 初始化三个情侣的弹幕区（在 DOM 加载后调用）
        window.initCoupleDanmaku = function() {
            // Kira & Lacus
            const kiraList = document.getElementById('danmaku-list-kira');
            if (kiraList) {
                window.renderDanmaku('kira', 'danmaku-list-kira');
            }
            // Athrun & Cagalli
            const athrunList = document.getElementById('danmaku-list-athrun');
            if (athrunList) {
                window.renderDanmaku('athrun', 'danmaku-list-athrun');
            }
            // Shinn & Lunamaria
            const shinnList = document.getElementById('danmaku-list-shinn');
            if (shinnList) {
                window.renderDanmaku('shinn', 'danmaku-list-shinn');
            }
        };

        // 页面加载后自动初始化弹幕
        setTimeout(() => {
            if (typeof window.initCoupleDanmaku === 'function') {
                window.initCoupleDanmaku();
            }
        }, 800);
